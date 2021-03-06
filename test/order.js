const examples = require('./examples')
const orders = require('../controllers/database/orders')
const prices = require('../controllers/prices')
const { convertData } = require('../controllers/baselinker')

const time = 86400 * 7
const downloadOrders = async (year,month,day,period = 1) => {
  for (let i = 0; i < period; i++) {
    const date = new Date (convertData(year, month, day + i) * 1000)
    console.log(`Data: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    await orders.updateFromData(year,month,day + i,1)
    console.log(`-----------------------------------------`)
  }
}

const today = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
}

//downloadOrders(2022,02,1,30) // (YEAR, MONTH, DAY, PERIOD)

const testingAll = async () => {
  const start = new Date()
  let count = 0
  let broken = 0
  for(const storageName in examples.storageList) {
    try {
      const endObject = await prices.getPrices(examples.storageList[storageName],storageName,true)
      if(!endObject[0].price.buy.brutto) {
        console.log(`${storageName} don't work`)
        console.log(`EAN: ${endObject[0].ean}`)
        console.log(`SKU: ${endObject[0].sku}`)
        console.log('----------------------------------------------------------------')
        broken++
      }
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

const zeroPrice = async (year,month,day) => {
  await orders.updatePrice(year,month,day)
}

const test = async () => {
  await downloadOrders(today.year,today.month,today.day - 30,30)
}

test()

//zeroPrice(2022,01,01)

//testingAll()

//testingSingle('K2')