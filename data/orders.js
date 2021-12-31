const mongoose = require('./connect')
const baselinker = require('./baselinker')
const products = require('./products')

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
			price_netto_buy: Number,
			price_brutto_buy: Number,
			price_netto_sell:Number,
			price_brutto_sell: Number,
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
    order.products.forEach((e) => {
      productsArr.push({
        name: e.name,
        sku: e.sku,
        ean: e.ean,
        storage_id: e.storage_id,
        storage_name: '',
        price_netto_buy:0,
        price_brutto_buy:0,
        price_netto_sell: nettoPrice(e.price_brutto,e.tax_rate),
        price_brutto_sell: e.price_brutto,
        tax_rate: e.tax_rate,
        quantity: e.quantity,
        profit: 0,
        location: e.location,
        auction_id: e.auction_id,
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
  async update (year, month, day) {
    const startDate = await baselinker.convertData(year, month, day)
    const endDate = startDate + 86400 // One day uptade to more flex
    const productsBuffor = []

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
            this.create(convertedOrder)
            convertedOrder.products.forEach(product => {
              let exist = false
              //Test ean or sku
              if(products.testEAN(product.ean)) {
                productsBuffor.forEach(element => {
                  exist = product.ean === element.ean
                })
              } else if (products.testSKU(product.sku)) {
                productsBuffor.forEach(element => {
                  exist = product.sku === element.sku
                })
              }
              if(!exist) { 
                productsBuffor.push(product)
              }
            })
          }
        }
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await this.load(nextDate)
      }
    } while (nextDate < endDate)
    productsBuffor.forEach((product) => {products.update(product)}) //Load or update products
  }
}

module.exports = orders