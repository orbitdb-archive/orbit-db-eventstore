import Store from 'orbit-db-store'
import EventIndex from './EventIndex.js'

// TODO: generalize the Iterator functions and spin to its own module

export default class EventStore extends Store {
  constructor (ipfs, id, dbname, options = {}) {
    if (options.Index === undefined) Object.assign(options, { Index: EventIndex })
    super(ipfs, id, dbname, options)
    this._type = 'eventlog'
    this.events.on('log.op.ADD', (address, hash, payload) => {
      this.events.emit('db.append', payload.value)
    })
  }

  add (data, options = {}) {
    return this._addOperation({
      op: 'ADD',
      key: null,
      value: data
    }, options)
  }

  get (hash) {
    return this.iterator({ gte: hash, limit: 1 }).collect()[0]
  }

  iterator (options) {
    const messages = this._query(options)
    let currentIndex = 0
    const iterator = {
      [Symbol.iterator] () {
        return this
      },
      next () {
        let item = { value: null, done: true }
        if (currentIndex < messages.length) {
          item = { value: messages[currentIndex], done: false }
          currentIndex++
        }
        return item
      },
      collect: () => messages
    }

    return iterator
  }

  _query (opts) {
    if (!opts) opts = {}

    const amount = opts.limit ? (opts.limit > -1 ? opts.limit : this._index.get().length) : 1 // Return 1 if no limit is provided
    const events = this._index.get().slice()
    let result = []

    if (opts.gt || opts.gte) {
      // Greater than case
      result = this._read(events, opts.gt ? opts.gt : opts.gte, amount, !!opts.gte)
    } else {
      // Lower than and lastN case, search latest first by reversing the sequence
      result = this._read(events.reverse(), opts.lt ? opts.lt : opts.lte, amount, opts.lte || !opts.lt).reverse()
    }

    if (opts.reverse) {
      result.reverse()
    }

    return result
  }

  _read (ops, hash, amount, inclusive) {
    // Find the index of the gt/lt hash, or start from the beginning of the array if not found
    const index = ops.map((e) => e.hash).indexOf(hash)
    let startIndex = Math.max(index, 0)
    // If gte/lte is set, we include the given hash, if not, start from the next element
    startIndex += inclusive ? 0 : 1
    // Slice the array to its requested size
    const res = ops.slice(startIndex).slice(0, amount)
    return res
  }
}
