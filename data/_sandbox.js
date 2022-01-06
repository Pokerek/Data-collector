/*const baselinker = require('./baselinker');
const orders = require('./orders');
const products = require('./products');
const statuses = require('./statuses')
const storages = require('./storages')*/
const examples = require('./examples')
const prices = require('./prices/prices')
const wholesalers = require('./prices/wholesalers')

//orders.updateFromData(2021,12,30)

const testingAll = async () => {
  //const storageName = "B2BTRADE"
  const start = new Date()
  let count = 0
  for(const storageName in examples.storageList) {
    const endObject = await prices.getPrices(examples.storageList[storageName],storageName)
    console.log(`Storage name: ${storageName}`)
    console.log(endObject[0].profit)
    console.log(endObject[0].price.buy)
    console.log(endObject[0].price.sell)
    console.log('----------------------------------------------------------------')
    count++
  }
  const end = (new Date() - start) / 1000
  console.log(`Execution time for ${count} storages: ${end}s`)
}

const testingSingle = async (storageName) => {
  const start = new Date()
  const endObject = await prices.getPrices(examples.storageList[storageName],storageName)
  console.log(`Storage name: ${storageName}`)
  console.log(endObject[0].profit)
  console.log(endObject[0].price.buy)
  console.log(endObject[0].price.sell)
  console.log('----------------------------------------------------------------')
  const end = (new Date() - start) / 1000
  console.log(`Execution time for ${storageName}: ${end}s`)
}

testingAll()

//testingSingle('ACTION')