const baselinker = require('./baselinker');
//const products = require('./products');
//const statuses = require('./statuses')
//const storages = require('./storages')
//const orders = require('./orders');
const examples = require('./examples')
const prices = require('./prices/prices')
//const wholesalers = require('./prices/wholesalers')
//const daily_raport=require('./prices/daily_raport')

//orders.updateFromData(2022 , 1, 6)

const testingAll = async () => {
  //const storageName = "B2BTRADE"
  const start = new Date()
  let count = 0
  let broken = 0
  for(const storageName in examples.storageList) {
    try {
      const endObject = await prices.getPrices(examples.storageList[storageName],storageName)
      console.log(`Storage name: ${storageName}`)
      console.log(endObject[0].profit)
      console.log(endObject[0].price.buy)
      console.log(endObject[0].price.sell)
      console.log('----------------------------------------------------------------')
      count++
    } catch (error) {
      console.log(`Storage ${storageName} failed.`,error)
      broken++
    } finally {
      continue
    }
  }
  const end = (new Date() - start) / 1000
  console.log(`Execution time for ${count} storages: ${end}s`)
  console.log(`Broken storages: ${broken}`)
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

const test = async () => {
  const data = await baselinker.getCancellations(baselinker.convertData(2021,12,30))
  console.log(data)
}

const profit = prices.calculateProductProfit({buy: {netto: 11.37, brutto: 13.99}, sell: {netto: 16.26, brutto: 20.99}},23)

console.log(profit)
