'use strict'

class EventIndex {
  constructor() {
    this._index = []
  }

  get() {
    return this._index
  }

  updateIndex(oplog) {
    this._index = oplog.items
  }
}

module.exports = EventIndex
