'use strict'

class EventIndex {
  constructor() {
    this._index = []
  }

  get() {
    return this._index ? this._index : []
  }

  updateIndex(oplog) {
    this._index = oplog.values
  }
}

module.exports = EventIndex
