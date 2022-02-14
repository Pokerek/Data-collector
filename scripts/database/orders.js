const baselinker = require('../../controllers/baselinker')
const products = require('./products')
const storages = require('./storages')
const prices = require('../prices')
const profit = require('../prices/profit')
const missedList = require('../logs/missedList')
const Order = require('../../models/order')
const statuses = require('./statuses')

const orders = {
  async create(data) {
    const order = new Order(data)
    await order.save()
  },
  async convert(order) {
    return {
      order_id: order.order_id,
      admin_comments: order.admin_comments,
      profit: 0,
      cancelled: false,
      ordered: false,
      status: await statuses.get(order.status_id),
      date: {
        add: order.date_add,
        confirmed: order.date_confirmed,
        status: order.date_in_status
      },
      delivery: {
        method: order.delivery_method,
        price: order.delivery_price,
        cost: 0,
        returned: false,
        smart: (order.delivery_price == 0 || order.delivery_price == 3.99)
      },
      products: await products.get(order.products)
    }
  },
  async updateFromData (year, month, day, period = 1,hidden = true) {
    const startDate = baselinker.convertData(year, month, day),
          endDate = baselinker.convertData(year,month,day + period,0,0,-1),
          ordersBuffor = []
    let productsBuffor = []
    let outletBuffor = []
    let storageCount = 0
    //First init
    let data = await baselinker.getOrders(startDate)
    let nextDate
    //Loop until load all data (Max 100 per run)
    do {
      for (let index in data) {
        const newOrder = this.convert(data[index])
        if(newOrder.date_confirmed < endDate) {
          const order = await Order.findOne({order_id: newOrder.order_id})
          if(order) {
            if(order.admin_comments !== newOrder.admin_comments) { order.admin_comments = newOrder.admin_comments } // change admin comments
            if(order.status_id !== newOrder.status_id || order.date_in_status !== newOrder.date_in_status) { //changes in order
              //Change status_id in db
              if(!order.delivery.returned) { order.delivery.price = newOrder.delivery.price } // Change in delivery price
              switch (newOrder.status_id) { //Order buy in storage
                case 289433:
                case 289441:
                case 275301:
                case 276221:
                case 257285:
                case 275294:
                  order.ordered = true
                  break
              }
              order.status_id = newOrder.status_id
              order.date_in_status = newOrder.date_in_status
              if(order.status_id === 289429 || order.status_id === 297987) { //Canceled
                order.cancelled = true 
              } else { //Update products
                for(const newProduct of newOrder.products) {
                  let notFound = true, notExist = true
                  for(const index in order.products) {
                    const product = order.products[index]
                    if(newProduct.ean === product.ean && newProduct.auction_id === product.auction_id) {
                      if(product.quantity.actual > newProduct.quantity.actual) { //quantity update
                        product.quantity.returned = product.quantity.actual - newProduct.quantity.actual
                      } else if (product.quantity.actual < newProduct.quantity.actual) {
                        product.quantity.returned -= newProduct.quantity.actual - product.quantity.actual
                        if(product.quantity.returned < 0) {product.quantity.returned = 0}
                        product.quantity.actual = newProduct.quantity.actual
                      }
                      product.sell = newProduct.sell
                      product.location = newProduct.location
                      product.ean = newProduct.ean
                      product.sku = newProduct.sku
                      product.profit = profit.toProduct(product.price,product.tax_rate) //recalculate profit form product
                      notFound = notExist = false
                      order.products[index] = product // back to order
                      break
                    }
                    if(index === (order.products.length - 1) && notExist){
                      //remove product
                    }
                  }
                  if(notFound) {
                    //Find last price from products db
                    //Profit = -buy.netto
                    order.products.push(newProduct) // Add new product to order
                  }
                }
              } 
              if(order.admin_comments === 'zwrot z dostawą') { //Delivery cost returned (true)
                order.delivery.returned = true
                order.delivery.price = 0
              }
              order.profit = profit.toOrder(order)
            }
            await order.save()
          } else {
            for (const index in newOrder.products) {
              const product = newOrder.products[index]
              const storageName = newOrder.products[index].storage_name = await storages.getName(product.storage_id)
              if (products.testOUTLET(product.sku)) { // grab outlet
                outletBuffor.push(product)
              } else if(productsBuffor[storageName]) { // add product to array o storage
                if(products.testEAN(product.ean,productsBuffor[storageName]) || products.testSKU(product.sku,productsBuffor[storageName])) { //Test ean or sku
                  productsBuffor[storageName].push(product)
                }
              } else { // create array for storage
                productsBuffor[storageName] = []
                productsBuffor[storageName].push(product)
                storageCount++
              }
            }
            ordersBuffor.push(newOrder)
          }
        }
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await baselinker.getOrders(nextDate)
      }
    } while (nextDate < endDate && data.length > 0)

    let count = 1
    for(const storage in productsBuffor) { //Loop for storages
      console.log(`Progress ${count} / ${storageCount} > ${storage} <`)
      if(1) {
        productsBuffor[storage] = await prices.getPrices(productsBuffor[storage],storage,hidden) //Prices load from storages
      }
      for(const product of productsBuffor[storage]) {
        products.update(product) 
      }
      count++
    }
    for(const product of outletBuffor) { // Loop for outlet

    }
    ordersBuffor.forEach((order) => { // Loop to create order
      for(const product of order.products) {
        if(product.profit < 0 && product.storage_name !== 'OUTLET') { missedList.add(product,'Profit') } //Error with profit
      }
      order.delivery.cost = profit.toDeliveryCost(order)

      if(order.admin_comments === 'zwrot z dostawą') { //Delivery cost returned (true)
        order.delivery.returned = true
        order.delivery.price = 0
      }
      if(order.status_id === 289429 || order.status_id === 297987) { //Canceled
        order.cancelled = true 
      }
      order.ordered = (order.status_id !== 198313 && order.status_id !== 251543 && order.status_id !== 289431 && order.status_id !== 289434 && order.status_id !== 289436) ? true : false
      order.profit = profit.toOrder(order)
      this.create(order) // Create new order
    })
    missedList.save('Orders') // Generate list for not found products or error
  },

  async updatePrice(year,month,day) {
    const date = baselinker.convertData(year, month, day)
    const data = await this.loadZeroFrom(date)
    let updated = 0
    console.log(`Orders to update price: ${data.length}`)
    let productsBuffor = []
    for (const index in data) {
      data[index].products.forEach(product => {
        if(product.price.buy.brutto === 0) {
          const storageName = product.storage_name
          if(productsBuffor[storageName]) { // add product to array o storage
            if(products.testEAN(product.ean,productsBuffor[storageName]) || products.testSKU(product.sku,productsBuffor[storageName])) { //Test ean or sku
              productsBuffor[storageName].push(product)
            }
          } else if (storageName !== 'OUTLET') { // create array for storage
            productsBuffor[storageName] = []
            productsBuffor[storageName].push(product)
          }
        }
        
      })
    }
    for(const storage in productsBuffor) { //Loop for storages
      productsBuffor[storage] = await prices.getPrices(productsBuffor[storage],storage,true) //Prices load from storages
      for(const product of productsBuffor[storage]) {
        if(product.price.buy.brutto !== 0) {
          const search = {
            'products.ean': product.ean,
            'products.sku': product.sku,
            date_confirmed: {$gte: date},
            'products.price.buy.brutto': 0,
            'products.storage_name': {$ne: 'OUTLET'}
          }
          let dbOrder = await Order.findOne(search)
          let safe = 0
          while (dbOrder && safe < 5) {
            for(const dbProduct of dbOrder.products) {
              if(dbProduct.ean === product.ean && dbProduct.sku === product.sku) {
                if(dbProduct.price.buy.brutto === 0) {
                  dbProduct.price = product.price
                  dbProduct.profit = product.profit
                  updated++
                }
                break
              }
            }
            await dbOrder.save()
            dbOrder = await Order.findOne(search)
            safe++
          }
          if(safe) {
            missedList.add(product,'Infinite loop')
          } 
        }
      }
    }
    console.log(`Orders updated: ${updated}`)
    missedList.save('Zero')
  },

  async loadFromDate(start,end) {
    return await Order.find({date_add: {$gte: start, $lte: end}})
  },

  async loadZeroFrom(date) {
    return await Order.find({date_confirmed: {$gte: date}, 'products.storage_name': {$ne: 'OUTLET'}, 'products.price.buy.brutto': 0 })
  }
}

module.exports = orders