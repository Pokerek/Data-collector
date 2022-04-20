const baselinker = require('../../baselinker')
const products = require('../products')
const Order = require('../../../models/order')
const statuses = require('../statuses')
const profit = require('../../prices/profit')


const orders = {
  ordersBuffor: [],
  async create(orderData) {
    const order = new Order({
      order_id: orderData.order_id,
      comments: orderData.admin_comments,
      profit: 0,
      cancelled: false,
      notOrdered: true,
      source: this.decodeSource(orderData.order_source),
      company: orderData.order_source_id == '39975' ? 'FHU' : 'SILESIA',
      status: await statuses.getById(orderData.order_status_id),
      date: {
        add: orderData.date_add,
        confirmed: orderData.date_confirmed,
        status: orderData.date_in_status
      },
      delivery: {
        method: orderData.delivery_method,
        price: orderData.delivery_price,
        cost: 0,
        returned: false,
        smart: (orderData.delivery_price == 0 || orderData.delivery_price == 3.99)
      },
      products: await this.loadProducts(orderData.products)
    })
    await order.save()
    return order
  },
  async loadProducts(orderProducts) {
    const newProducts = []
    for(const product of orderProducts) {
      newProducts.push(await products.load(product))
    }
    return newProducts
  },
  async update(order) {
    const dbOrder = await Order.findOne({order_id: order.order_id}).populate('status','status_id -_id')
    if(!dbOrder) { return false }
    
    if(dbOrder.comments !== order.admin_comments) { 
      dbOrder.comments = order.admin_comments  // change admin comments
      dbOrder.delivery = this.backDelivery(dbOrder.delivery,dbOrder.comments) // check delivery status
    }
    
    if(!dbOrder.delivery.returned) { dbOrder.delivery.price = order.delivery_price } // Change in delivery price
    if(!dbOrder.cancelled) dbOrder.cancelled = await statuses.getCancelled(order.order_status_id) //Check canceled status
    if(dbOrder.notOrdered) dbOrder.notOrdered = await statuses.getNotOrdered(order.order_status_id) //Check ordered status
    
    if(dbOrder.status.status_id !== order.order_status_id || dbOrder.date.status !== order.date_in_status) { //changes in order
      dbOrder.status = await statuses.getById(order.order_status_id) //Change status
      dbOrder.date.status = order.date_in_status

      for(const index in dbOrder.products) {
        const answer = await products.updateInOrder(dbOrder.products[index], order.products)
        switch (answer) {
          case 'notExist':
            //remove
            break;
          case 'notFound':
            //add
            break;
          default:
            dbOrder.products[index] = answer
            break;
        }  
      }
      dbOrder.profit = profit.toOrder(dbOrder)
    }
    await dbOrder.save()
    return true
  },
  async updateFromData (year, month, day, period = 1,hidden = true) {
    const startDate = baselinker.convertData(year, month, day),
          endDate = baselinker.convertData(year,month,day + period,0,0,-1)
    //First init
    let data = await baselinker.getOrders(startDate)
    let nextDate
    //Loop until load all data (Max 100 per run)
    do {
      for (let index in data) {
        const order = data[index]
        if(order.date_confirmed < endDate) {
          if(await this.update(order)) {} else { 
            const newOrder = await this.create(order) // Create new order
            this.ordersBuffor.push(newOrder) 
          }
        } else break
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await baselinker.getOrders(nextDate)
      }
    } while (nextDate < endDate && data.length > 0)
    for(const order of this.ordersBuffor) { //loop to create orders
      order.delivery.cost = profit.toDeliveryCost(order)
      order.delivery = this.backDelivery(order.delivery,order.comments)

      order.populate('status', 'status_id -_id')
      order.cancelled = await statuses.getCancelled(order.status.status_id)
      order.notOrdered = await statuses.getNotOrdered(order.status.status_id) || order.comments.includes('NOW')
      
      await order.save()
    }
    await products.findPrices()
    this.savePrices()
  },
  async savePrices() { 
    while(this.ordersBuffor.length) {
      const order = this.ordersBuffor.shift()
      for (const index in order.products) {
        const details = await products.getDetails(order.products[index].product)
        order.products[index].price.buy = details.price.buy // Save prices
      }
      try {
        await order.save()
      } catch (err) {
        console.log(`Error order: ${order.order_id} - ${err.message}`)
      }
    }
  },
  async deleteFrom(year,month,day,period = 1) {
    const start = baselinker.convertData(year, month, day)
    const end = baselinker.convertData(year,month,day + period,0,0,-1)
    await Order.deleteMany({$and: [{'date.add': {$gte: start}},{'date.add': {$lt: end}}]})
  },
  /*async updatePrice(year,month,day) {
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
  },*/

  async loadFromDate(start,end) {
    return await Order.find({date_add: {$gte: start, $lte: end}})
  },

  async loadZeroFrom(date) {
    return await Order.find({date_confirmed: {$gte: date}, 'products.storage_name': {$ne: 'OUTLET'}, 'products.price.buy.brutto': 0 })
  },

  backDelivery(orderDelivery,comments) {
    if(comments === 'zwrot z dostawą') { //Delivery cost returned (true)
      orderDelivery.returned = true
      orderDelivery.price = 0
    }
    return orderDelivery
  },
  decodeSource(source) {
    if(source.includes('real')) {
      return 'KAUFLAND'
    } else if (source.includes('allegro')) {
      return 'ALLEGRO'
    } else if (source.includes('emag')) {
      return 'EMAG'
    } else if (source.includes('erli')) {
      return 'ERLI'
    } else {
      return source
    }
  },
  async get() {
    return await Order.find()
  }
}

module.exports = orders