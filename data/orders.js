const mongoose = require('./connect')
const baselinker = require('./baselinker')

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

async function createOrder(data) {
  const order = new Order(data)
  const result = await order.save()
  console.log(result)
}

function convertOrder(order) {
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
}

const nettoPrice = (brutto,tax, place = 2) => {
  return (brutto / (1 + tax / 100)).toFixed(place) * 1
}

async function loadOrders () {
  const date = await baselinker.convertData(2021,12,28)
  const data = await baselinker.getOrders(date)
  // data.forEach((e) => {
  //   createOrder(convertOrder(e))
  // })
  console.log(convertOrder(data[0]))
}