let genericStoreLabel = 'generic'

const setItem = ({db, name}) => (key, val) => new Promise((resolve, reject) => {
  const trx = db.transaction([genericStoreLabel], 'readwrite')
  trx.oncomplete = () => resolve(true)
  trx.onerror = (e) => reject(e)

  const objectStore = trx.objectStore(genericStoreLabel)
  const reqGet = objectStore.get(key)
  reqGet.onsuccess = (e) => {
    console.log('get the thing?')
    console.log(key)
    console.log(e.target.result)
    if (e.target.result) {
      console.log('put this thing to store')
      const reqPut = objectStore.put({
        id: key,
        val
      })
      reqPut.onsuccess = (event) => {
        console.log('did put the thing in the store')
      }
      reqPut.onerror = (event) => {
        console.log('objectStoreRequest error')
        console.log(event)
      }
    } else {
      console.log('add new thing to store')
      const reqAdd = objectStore.add({
        id: key,
        val
      })
      reqAdd.onsuccess = (event) => {
        console.log('did put the thing in the store')
      }
      reqAdd.onerror = (event) => {
        console.log('objectStoreRequest error')
        console.log(event)
      }
    }
  }

  return true
})

// const getItem = db => async (key) => {
//   console.log('getItem', key)
//   return true
// }
// const getItems = db => async () => {
//   console.log('getItems', [])
//   return true
// }
// const delItem = db => async (key) => {
//   console.log('delItem', key)
//   return true
// }
// const updateItem = db => async (key, val) => {
//   console.log('updateItem', key, val)
//   return true
// }

const methods = ({db, name}) => {
  return {
    setItem: setItem({db, name}),
    // getItem: getItem({db, name}),
    // getItems: getItems({db, name}),
    // delItem: delItem({db, name}),
    // updateItem: updateItem({db, name})
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
