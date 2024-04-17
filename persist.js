const setItem = ({db, name}) => (key, val) => new Promise((resolve, reject) => {
  const trx = db.transaction([name], 'readwrite')
  trx.oncomplete = () => resolve(true)
  trx.onerror = (e) => reject(e)
  console.log('setItem', key, val)
  console.log(db, name)
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
  const DBOpenRequest = window.indexedDB.open(name)

  DBOpenRequest.onerror = (e) => reject(e)
  DBOpenRequest.onsuccess = (e) => {
    db = DBOpenRequest.result
    resolve(methods({db, name}))
  }
})

export default client