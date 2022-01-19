const baselinker = require('./baselinker');
//const products = require('./products');
//const statuses = require('./statuses')
//const storages = require('./storages')
const outlet = require('./outlet')
const orders = require('./orders');
const examples = require('./examples')
const prices = require('./prices/prices');
const { TELFORCEONE } = require('./prices/wholesalers');
const { getNotFullCancellations } = require('./baselinker');
//const wholesalers = require('./prices/wholesalers')
//const daily_raport=require('./prices/daily_raport')

//orders.updateFromData(2022 , 1, 17)

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


//const profit = prices.calculateProductProfit({buy: {netto: 11.37, brutto: 13.99}, sell: {netto: 16.26, brutto: 20.99}},23)

//testingSingle('LAMEX')

const outletTest = async () => {

  await outlet.loadOutlet(2022, 1, 6)
  //await orders.loadOrdersFromDatabase(2022, 1, 17)
  //console.log(await baselinker.getProductId)
  //console.log(baselinker.convertData)
  //console.log(await baselinker.getCancellations())
  //const product_id = await baselinker.getProductId('shop_24301','6920680873173')
  //const product_data= await baselinker.getProductData('shop_24301', product_id)
  //console.log(product_data)
  //const outlets=await outlet.loadOutletFromDatabase()
  //console.log(await outlets[0].found_data)
  //console.log(await baselinker.changeProductQuantityForDomyslny('1029628553', 3))

  //const actualOutletProduct=await outlet.loadOutletFromDatabase()

  //console.log(actualOutletProduct)

  //console.log(await baselinker.addNewProduct(actualOutletProduct))

}


outletTest()