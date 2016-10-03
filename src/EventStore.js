'use strict'

const slice = require('lodash.slice')
const take = require('lodash.take')
const findIndex = require('lodash.findIndex')
const Store = require('orbit-db-store')
const EventIndex = require('./EventIndex')

class EventStore extends Store {
  constructor(ipfs, id, dbname, options = {}) {
    if(options.Index === undefined) Object.assign(options, { Index: EventIndex })
    super(ipfs, id, dbname, options)
  }

  add(data) {
    return this._addOperation({
      op: 'ADD',
      key: null,
      value: data,
      meta: {
        ts: new Date().getTime()
      }
    })
  }

  get(hash) {
    return this.iterator({ gte: hash, limit: 1 }).collect()[0]
  }

  iterator(options) {
    const messages = this._query(this.dbname, options)
    let currentIndex = 0
    let iterator = {
      [Symbol.iterator]() {
        return this
      },
      next() {
        let item = { value: null, done: true }
        if(currentIndex < messages.length) {
          item = { value: messages[currentIndex], done: false }
          currentIndex ++
        }
        return item
      },
      collect: () => messages
    }

    return iterator
  }

  _query(dbname, opts) {
    if(!opts) opts = {}

    const amount = opts.limit ? (opts.limit > -1 ? opts.limit : this._index.get().length) : 1 // Return 1 if no limit is provided
    const events = this._index.get()
    let result = []

    if(opts.gt || opts.gte) {
      // Greater than case
      result = this._read(events, opts.gt ? opts.gt : opts.gte, amount, opts.gte ? true : false)
    } else {
      // Lower than and lastN case, search latest first by reversing the sequence
      result = this._read(events.reverse(), opts.lt ? opts.lt : opts.lte, amount, opts.lte || !opts.lt).reverse()
    }

    return result
  }

  _read(ops, hash, amount, inclusive) {
    // Find the index of the gt/lt hash, or start from the beginning of the array if not found
    let startIndex = Math.max(findIndex(ops, (e) => e.hash === hash), 0)
    // If gte/lte is set, we include the given hash, if not, start from the next element
    startIndex += (inclusive ? 0 : 1)
    // Slice the array to its requested size
    return take(ops.slice(startIndex), amount)
  }
}

module.exports = EventStore
