const baselinker = require('./baselinker');
const products = require('./products/products');
//const statuses = require('./statuses')
const storages = require('./storages')
//const storages = require('./storages')
const outlet = require('./outlet')
const orders = require('./orders');
const examples = require('./examples')
const prices = require('./prices/prices');
const { TELFORCEONE } = require('./prices/wholesalers');
const { getNotFullCancellations } = require('./baselinker');
//const wholesalers = require('./prices/wholesalers')
//const daily_raport=require('./prices/daily_raport')
const missedList = require('./products/missedList')

const time = 86400 * 7
const downloadOrders = async (dayStart,dayEnd,month,year) => {
  for (let day = dayStart; day <= dayEnd; day++) {
    console.log(`Data: ${year}-${month}-${day}`)
    await orders.updateFromData(year,month,day)
    console.log(`-----------------------------------------`)
  }
}

//downloadOrders(20,20,01,2022) // (FROM, TO, month, year)

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
  missedList.save()
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

testingSingle("AMIO")

//const profit = prices.calculateProductProfit({buy: {netto: 11.37, brutto: 13.99}, sell: {netto: 16.26, brutto: 20.99}},23)

//testingSingle('DMTRADE')

const outletTest = async () => {

  //await outlet.loadOutlet(2022, 1, 19)
  //await orders.loadOrdersFromDatabase(2022, 1, 17)
  //console.log(await baselinker.getProductId)
  //console.log(baselinker.convertData)
  //console.log(await baselinker.getNotFullCancellations())
  //const product_id = await baselinker.getProductId('warehouse_2845','8001090728951')
  //console.log(product_id)
  //const product_id2 = await baselinker.getProductIdForInventory('2043','9111201920118')
  //console.log(product_id2)
  //const product_data= await baselinker.getProductIdData('25092','5902216909700')
  //console.log(product_data)
  //const product_data= await baselinker.getProductDataforInventory('2043', product_id2)
  //console.log(product_data)
  //const outlets=await outlet.loadOutletFromDatabase()
  //console.log(await outlets[0].found_data)
  //console.log(await baselinker.changeProductQuantityForDomyslny('1029628553', 3))
  //console.log(await baselinker.getExternalStorageProductData("shop_25092", ['nukfc-018']))
  //console.log(await baselinker.checkIfProductIsInDomyslny(8809716070657, 'OUTLET'))
  //const actualOutletProduct=await outlet.loadOutletFromDatabase()

  //console.log(actualOutletProduct)
  
  await outlet.addOutletToSystem()

  //console.log(await baselinker.addNewProduct(actualOutletProduct))

}

//orders.updateFromData(2022 , 1, 20)
//outletTest()
