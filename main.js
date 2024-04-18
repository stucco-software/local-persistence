import newDB from './persist.js'

const db = await newDB()
await db.setItem('one', 'what')
// await db.setItem('two', {some: 'thing'})
// await db.setItem('three', [1, 2, 3])
// await db.setItem('four', [{
//   thing: 1
// },{
//   thing: 2
// }])
// await db.setItem('five', 'omg it works')


// let update = await db.updateItem('two', {some: 'thang'})
// console.log(update)
// await db.delItem('one')
// await db.getItems()
// let all = await db.getItems()
// console.log(`-----`)
// console.log(all)
