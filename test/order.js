const examples = require('./examples')
const orders = require('../scripts/products/orders')
const prices = require('../scripts/prices/prices')

const time = 86400 * 7
const downloadOrders = async (dayStart,dayEnd,month,year) => {
  for (let day = dayStart; day <= dayEnd; day++) {
    console.log(`Data: ${year}-${month}-${day}`)
    await orders.updateFromData(year,month,day)
    console.log(`-----------------------------------------`)
  }
}

downloadOrders(26,26,01,2022) // (FROM, TO, month, year)

const testingAll = async () => {
  const start = new Date()
  let count = 0
  let broken = 0
  for(const storageName in examples.storageList) {
    try {
      const endObject = await prices.getPrices(examples.storageList[storageName],storageName,true)
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

//testingAll()

//testingSingle('TELFORCEONE')