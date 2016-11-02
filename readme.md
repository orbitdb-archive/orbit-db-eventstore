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
npm install orbit-db ipfs
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

  *Inherits from https://github.com/haadcode/orbit-db-store#orbit-db-store*

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

  See [Events](https://github.com/haadcode/orbit-db-store#events) for full description

## Contributing

See [orbit-db's contributing guideline](https://github.com/haadcode/orbit-db#contributing).

## License

[MIT](LICENSE) ©️ 2016 Haadcode
