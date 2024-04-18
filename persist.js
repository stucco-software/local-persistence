let genericStoreLabel = 'generic'

const storeSuccess = (e) => {}

const storeError = (e) => console.log(e)

const reqPut = (store) => (obj) => {
  let req = store.put(obj)
  req.onsuccess = storeSuccess
  req.onerror = storeError
}

const reqAdd = (store) => (obj) => {
  let req = store.add(obj)
  req.onsuccess = storeSuccess
  req.onerror = storeError
}

const reqDel = (store) => (key) => {
  let req = store.delete(key)
  req.onsuccess = storeSuccess
  req.onerror = storeError
}

const setItem = ({db, name}) => (key, val) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  trx.oncomplete = () => resolve(true)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  const reqGet = objectStore.get(key)
  reqGet.onsuccess = (e) => {
    if (e.target.result) {
      reqDel(objectStore)(key)
    }
    reqAdd(objectStore)({
      id: key,
      val
    })
  }
})

const updateItem = ({db, name}) => (key, val) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  let old
  let updated
  trx.oncomplete = () => resolve(updated)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  const reqGet = objectStore.get(key)
  reqGet.onsuccess = (e) => {
    old = e.target.result.val
    updated = Object.assign(old, val)
    reqPut(objectStore)({
      id: key,
      val: updated
    })
  }
})

const getItem = ({db, name}) => (key) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  let result
  trx.oncomplete = () => resolve(result)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  const reqGet = objectStore.get(key)
  reqGet.onsuccess = (e) => {
    result = e.target.result.val
  }
})

const getItems = ({db, name}) => (key) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  let result = new Map()
  trx.oncomplete = () => resolve(result)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  const reqGetAll = objectStore.getAll()
  reqGetAll.onsuccess = (e) => {
    result = new Map(event.target.result.map((obj) => [obj.id, obj.val]))
  }
})

const delItem = ({db, name}) => (key) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  trx.oncomplete = () => resolve(true)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  reqDel(objectStore)(key)
})

const clear = ({db, name}) => () => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  trx.oncomplete = () => resolve(true)
  trx.onerror = (e) => reject(e)
  const objectStore = trx.objectStore(genericStoreLabel)
  objectStore.clear()
})

const methods = ({db, name}) => {
  return {
    setItem: setItem({db, name}),
    updateItem: updateItem({db, name}),
    getItem: getItem({db, name}),
    getItems: getItems({db, name}),
    delItem: delItem({db, name}),
    clear: clear({db, name})
  }
}

const client = (name = 'persistence') => new Promise((resolve, reject) => {
  let db
  const DBOpenRequest = window.indexedDB.open(name, 2)

  DBOpenRequest.onerror = (e) => {
    console.log('DBOpenRequest error')
    console.log(e)
    reject(e)
  }
  DBOpenRequest.onsuccess = (e) => {
    db = DBOpenRequest.result
    resolve(methods({db, name}))
  }
  DBOpenRequest.onupgradeneeded = (event) => {
    db = event.target.result
    // Create an objectStore for this database
    const objectStore = db.createObjectStore(genericStoreLabel, { keyPath: 'id' })
  }
})

export default client
