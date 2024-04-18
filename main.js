import newDB from './persist.js'

const db = await newDB()
await db.setItem('one', 'what')
await db.setItem('two', {some: 'thing'})
await db.setItem('three', [1, 2, 3])
await db.setItem('four', [{
  thing: 1
},{
  thing: 2
}])
// await db.updateItem('two', {neat: 'wow'})
// await db.delItem('one')
// await db.getItems()