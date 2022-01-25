const mongoose = require('../database/mongoose')
const baselinker = require('../baselinker/baselinker')
const products = require('./products')
const storages = require('../database/storages')
const prices = require('../prices/prices')
const profit = require('../prices/profit')
const missedList = require('./missedList')

const orderSchema = new mongoose.Schema({
  order_id: Number,
  shop_order_id: Number,
  date_add: Number,
	date_confirmed: Number,
	date_in_status: Number,
	admin_comments: String,
	delivery: {
    method: String,
    price: Number,
    cost: Number,
    returned: Boolean
  },
  profit: Number,
  cancelled: Boolean,
  delivery_price_returned: Boolean,
	products: [{
			name: String,
			sku: String,
			ean: String,
      storage_id: Number,
      storage: String,
			storage_name: String,
      price: {
        buy: {
          netto: Number,
          brutto: Number
        },
        sell: {
          netto: Number,
          brutto: Number
        }
      },
			tax_rate: Number,
			quantity: Number,
      profit: Number,
			location: String,
			order_id: String,
      auction_id: String,
      source_id:String
  }]
})

const Order = mongoose.model('Order', orderSchema)

const orders = {
  
  async create(data) {
    const order = new Order(data)
    await order.save()
  },
  convert(order) {
    const productsArr = []
    order.products.forEach((product) => {
      productsArr.push({
        name: product.name,
        sku: product.sku,
        ean: product.ean,
        storage_id: product.storage_id,
        storage: product.storage,
        storage_name: '',
        price: {
          buy: {
            netto: 0,
            brutto: 0
          },
          sell: {
            netto: prices.nettoPrice(product.price_brutto,product.tax_rate),
            brutto: product.price_brutto
          }
        },
        tax_rate: product.tax_rate,
        quantity: product.quantity,
        profit: 0,
        location: product.location,
        order_id: order.order_id,
        auction_id: product.auction_id,
        source_id: order.order_source_id
      })
    })
    return {
      order_id: order.order_id,
      shop_order_id: order.shop_order_id,
      date_add: order.date_add,
      date_confirmed: order.date_confirmed,
      date_in_status: order.date_in_status,
      admin_comments: order.admin_comments,
      delivery: {
        method: order.delivery_method,
        price: order.delivery_price,
        cost: 0,
        returned: false
      },
      profit: 0,
      cancelled: false,
      products: productsArr
    }
  },
  async exist(id) {
    const order = await Order.findOne({order_id: id})
    return order
  },  
  
  async updateFromData (year, month, day, period = 1) {
    const startDate = baselinker.convertData(year, month, day),
          endDate = startDate + 86400 * period,
          ordersBuffor = []
    let productsBuffor = []
    let storageCount = 0
    //First init
    let data = await baselinker.getOrders(startDate)
    let nextDate = startDate
    //Loop until load all data (Max 100 per run)
    do {
      for (let index in data) {
        if(data[index].date_confirmed < endDate) {
          const order = await this.exist((data[index]).order_id)
          if(order) {
            //changes in order
            
          } else {
            const convertedOrder = this.convert(data[index])
            for (const index in convertedOrder.products) {
              const product = convertedOrder.products[index]
              const storageName = convertedOrder.products[index].storage_name = await storages.getName(product.storage_id)
              if (products.testOUTLET(product.sku)) { // grab outlet
                if (!productsBuffor['OUTLET']) {
                  productsBuffor['OUTLET'] = []
                  storageCount++
                }
                productsBuffor['OUTLET'].push(product)
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
            ordersBuffor.push(convertedOrder)
          }
        }
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await baselinker.getOrders(nextDate)
      }
    } while (nextDate < endDate)

    let count = 1
    for(const storage in productsBuffor) {
      console.log(`Progress ${count} / ${storageCount} > ${storage} <`)
      if(storage === "OUTLET") {
        //loop for outlet
        //removeSold
      } else {
        //if(storage !== "VIVAB2B") {
        if(1) {
          productsBuffor[storage] = await prices.getPrices(productsBuffor[storage],storage,true) //Prices load from storages
        }
        for(const product of productsBuffor[storage]) {
          products.update(product) 
        }
      }
      count++
    }
    missedList.save() // Generate list for not found products
    ordersBuffor.forEach((order) => { // Loop to create order
      order.delivery.cost = profit.toDeliveryCost(order)
      order.profit = profit.toOrder(order)
      this.create(order) // Create new order
    })
  },

  async load(year, month, day, time = 0) {
    const startDate = baselinker.convertData(year, month, day),
          endDate = startDate + time
    return await Order.find({date_confirmed: {$gte: startDate, $lt: endDate}})
  },

  /*async matchCancellations(year, month, day)
  {
    const data = baselinker.convertData(year, month, day)
    const cancellationsId=await baselinker.getCancellations(data);
    const database_orders=await this.load(year, month, day)
    for(let order of database_orders)
    {
      if(cancellationsId.includes(order.order_id))
      {

        await Order.findOneAndUpdate({ _id:order._id}, { cancelled: true });

        if(order.admin_comments.includes('zwrot z dostawą'))
        {
          await Order.findOneAndUpdate({ _id }, { delivery.returned: true });
        }
      }
    }

    return orders
  },

    

    async getProfitFromOrdersWithCancellations(year, month, day)
    {
        this.matchCancellations(year, month, day);
        let orders=await this.load(year, month, day);
        let profit=0;

        for(let order of orders)
        {
            if(!order.cancelled)
            {
              for(let product of order.products)
              {
                  profit+=product.profit;
              }
              
              profit+=order.delivery_price
            }
            else
            {
              for(let product of order.products)
              {
                  profit-=product.price.buy.brutto;
              }

              if(order.delivery_price_returned)
              {
                profit-=order.delivery_price
              }
              else
              {
                profit+=order.delivery_price
              }
            }
        }

        return profit;
    },
    
    async getLossFromCancellations(year, month, day)
    {
      this.matchCancellations(year, month, day);
      const orders=await orders.load(year, month, day);
      
      let loss=0;

      for(let order of orders)
      {
          if(order.cancelled)
          {
            for(let product of order.products)
            {
                loss+=product.price.buy.brutto;
            }

            if(order.delivery_price_returned)
            {
              loss+=order.delivery_price
            }
            else
            {
              loss-=order.delivery_price
            }
          }
      }

      return loss;
    },*/
}

module.exports = orders