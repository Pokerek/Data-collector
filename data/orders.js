const mongoose = require('./connect')
const baselinker = require('./baselinker')
const products = require('./products')
const storages = require('./storages')
const prices = require('./prices/prices')

const orderSchema = new mongoose.Schema({
  order_id: Number,
	date_confirmed: Number,
	date_in_status: Number,
	admin_comments: String,
	delivery_method: String,
  delivery_price: Number,
	products: [{
			name: String,
			sku: String,
			ean: String,
      storage_id: Number,
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
			location:String,
			auction_id: String
  }]
})

const Order = mongoose.model('Order', orderSchema)

const nettoPrice = (brutto,tax, place = 2) => {
  return (brutto / (1 + tax / 100)).toFixed(place) * 1
}

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
        storage_name: '',
        price: {
          buy: {
            netto: 0,
            brutto: 0
          },
          sell: {
            netto: nettoPrice(product.price_brutto,product.tax_rate),
            brutto: product.price_brutto
          }
        },
        tax_rate: product.tax_rate,
        quantity: product.quantity,
        profit: 0,
        location: product.location,
        auction_id: product.auction_id,
      })
    })
    return {
      order_id: order.order_id,
      date_confirmed: order.date_confirmed,
      date_in_status: order.date_in_status,
      admin_comments: order.admin_comments,
      delivery_method: order.delivery_method,
      delivery_price: order.delivery_price,
      products: productsArr
    }
  },
  async load (date) {
    return await baselinker.getOrders(date)
  },
  async exist(id) {
    const order = await Order.find({order_id: id})
    return order[0]
  },  
  async updateFromData (year, month, day, time = 86400) {
    const startDate = await baselinker.convertData(year, month, day),
          endDate = startDate + time,
          ordersBuffor = []
    let productsBuffor = []
    //First init
    let data = await this.load(startDate)
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
              if(productsBuffor[storageName]) {
                if(products.testEAN(product.ean,productsBuffor[storageName]) || products.testSKU(product.sku,productsBuffor[storageName])) { //Test ean or sku
                  productsBuffor[storageName].push(product)
                }  
              } else {
                productsBuffor[storageName] = []
                productsBuffor[storageName].push(product)
              }
              ordersBuffor.push(convertedOrder)
            }
          }
        }
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await this.load(nextDate)
      }
    } while (nextDate < endDate)
    for(const storage in productsBuffor) {
      productsBuffor[storage] = await prices.getPrices(productsBuffor[storage],storage) //Prices load from storages
      for(const product of productsBuffor[storage]) {
        products.update(product)
      }
    }
    ordersBuffor.forEach((order) => {
      this.create(order) // Create new order
    })
  },

  async loadOrdersFromDatabase()
    {
        let orders=await Order.find(function (err, orders) {
            if (err) return 'error';
            else return orders
        }).clone().catch(function(err){return err})
        return orders
    },

    async getProfitFromOrders()
    {
        const orders=await this.loadOrdersFromDatabase();
        let profit=0;

        for(let order of orders)
        {
            for(product of order.products)
            {
                profit+=product.profit;
            }

            profit+=order.delivery_price
        }

        return profit;
    },

    async getProfitFromOutlet()
    {
        const orders=await this.loadOrdersFromDatabase();
        let profit=0;

        for(let order of orders)
        {
            for(product of order.products)
            {
                if(product.location='')
                {
                    profit+=product.profit;
                }
                
            }
        }

        return profit;
    },
}

module.exports = orders