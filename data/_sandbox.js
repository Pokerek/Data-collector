const baselinker = require('./baselinker');
const orders = require('./orders');
const products = require('./products');
const statuses = require('./statuses')
const storages = require('./storages')
const examples = require('./examples')
const prices = require('./prices/prices')
const wholesalers = require('./prices/wholesalers')

orders.updateFromData(2021,12,30)

const testing = async () => {
  const storageName = "PARTNERTELE"
  const endObject = await prices.getPrices(examples.storageList[storageName],storageName)
  console.log(endObject)
  //console.log(wholesalers.HURTEL.priceSave({netto: 0,brutto: 0},'21,30 zł netto'))

}

testing()