# orbit-db-eventstore

> Eventlog for orbit-db

## Requirements

- Node.js v6.0 or later

## Install

```
npm install orbit-db-eventstore
```

## Usage

```javascript
const ipfs = require('ipfs')
const EventStore = require('orbit-db-eventstore')
const store = new EventStore(ipfs, 'user id', 'database name')

// Sync store with another store
// hash is the IPFS hash of otherStore.snapshot
store.sync(hash)

// Add an event
const hash = store.add({ data: 'hello friend' })

// Get a single event
store.get(hash)

// Get an iterator
const iter = store.iterator({ limit: 20, lt: hash }) // iterator
const items = iter.collect() // convert to an Array
/*
  Where `options` is:
  {
    limit: 100, // number of items to return
    gt: <hash>, // get events newer than <hash>
    lt: <hash>, // get events older than <hash>
    gte: <hash>, // get event newer than <hash> including <hash>
    lte: <hash>, // get event older than <hash> including <hash>
  }
*/
```

## API

**TODO**
