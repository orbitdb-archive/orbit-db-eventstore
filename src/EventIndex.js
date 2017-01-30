'use strict'

class EventIndex {
  get() {
    return this._index
  }

  updateIndex(oplog) {
    this._index = oplog.items
  }
}

module.exports = EventIndex
