# orbit-db-eventstore

[![npm version](https://badge.fury.io/js/orbit-db-eventstore.svg)](https://badge.fury.io/js/orbit-db-eventstore)

An append-only log with traversable history. Useful for *"latest N"* use cases or as a message queue.

Used in [orbit-db](https://github.com/haadcode/orbit-db).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install
```
npm install orbit-db
```

## Usage

First, create an instance of OrbitDB:

```javascript
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfs = new IPFS()
const orbitdb = new OrbitDB(ipfs)
```

Get a log database and add an entry to it:

```javascript
const log = orbitdb.eventlog('haad.posts')
log.add({ name: 'hello world' })
  .then(() => {
    const items = log.iterator().collect()
    items.forEach((e) => console.log(e.name))
    // "hello world"
  })
```

Later, when the database contains data, load the history and query when ready:

```javascript
const log = orbitdb.eventlog('haad.posts')
log.events.on('ready', () => {
  const items = log.iterator().collect()
  items.forEach((e) => console.log(e.name))
  // "hello world"
})
```

See [example/index.html]() for a detailed example. Note that to run this example, you need to have a local [IPFS daemon](https://dist.ipfs.io/go-ipfs/floodsub-2) [running](https://ipfs.io/docs/getting-started/) at port 5001.

## API

### eventlog(name)

  Package: 
  [orbit-db-eventstore](https://github.com/haadcode/orbit-db-eventstore)

  ```javascript
  const db = orbitdb.eventlog('site.visitors')
  ```

  - **add(event)**
    ```javascript
    db.add({ name: 'User1' }).then((hash) => ...)
    ```
    
  - **get(hash)**
    ```javascript
    const event = db.get(hash)
      .map((e) => e.payload.value)
    // { name: 'User1' }
    ```
    
  - **iterator([options])**
    ```javascript
    // TODO: add all options - gt, gte, lt, lte, limit, reverse
    const all = db.iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
    // [{ name: 'User1' }]
    ```
    
  - **events**

    ```javascript
    db.events.on('data', (dbname, event) => ... )
    ```

    See [events](#events) for full description.

### events

  Eventlog has an `events` ([EventEmitter](https://nodejs.org/api/events.html)) object that emits events that describe what's happening in the database.

  - `data` - (dbname, event)
    
    Emitted after an entry was added to the database

    ```javascript
    db.events.on('data', (dbname, event) => ... )
    ```

  - `sync` - (dbname)

    Emitted before starting a database sync with a peer.

    ```javascript
    db.events.on('sync', (dbname) => ... )
    ```

  - `load` - (dbname, hash)

    Emitted before loading the database history. *hash* is the hash from which the history is loaded from.

    ```javascript
    db.events.on('load', (dbname, hash) => ... )
    ```

  - `history` - (dbname, entries)

    Emitted after loading the database history. *entries* is an Array of entries that were loaded.

    ```javascript
    db.events.on('history', (dbname, entries) => ... )
    ```

  - `ready` - (dbname)

    Emitted after fully loading the database history.

    ```javascript
    db.events.on('ready', (dbname) => ... )
    ```

  - `write` - (dbname, hash)

    Emitted after an entry was added locally to the database. *hash* is the IPFS hash of the latest state of the database.

    ```javascript
    db.events.on('write', (dbname, hash) => ... )
    ```

## Contributing

See [orbit-db's contributing guideline](https://github.com/haadcode/orbit-db#contributing).

## License

[MIT](LICENSE) ©️ 2016 Haadcode
