const mongoose = require('./connect')
const axios = require('axios')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

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
			ean: Number,
      storage_id: Number,
			storage_name: String,
			price_netto_buy: Number,
			price_brutto_buy: Number,
			price_netto_sell:Number,
			price_brutto_sell: Number,
			tax_rate: Number,
			quantity: Number,
			location:String,
			auction_id: Number
  }]
})

const Order = mongoose.model('Order', orderSchema)

async function createOrder(data) {
  const order = new Order(data)
  const result = await order.save()
  console.log(result)
}

async function convertToUnixTimestamp(year, month, day, hours = 0, minutes = 0, seconds = 0)
{
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
}

function getOrdersPrepareData(from)
{
    return new URLSearchParams({
        'method':'getOrders',
        'parameters':`{"date_from":+${from}}`
    }).toString().replaceAll('%2B','+')
}

async function getOrders(token, from)
{
    const info = getOrdersPrepareData(from)
    try{
    const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': token,
        },
        data:info,
        
    });
        return await load.data.orders;
    } catch(err) {
        console.log(err);
    }
}

function convertOrder(order) {
  const productsArr = []
  order.products.forEach((e) => {
    productsArr.push({
      name: e.name,
      sku: e.sku,
      ean: e.ean,
      storage_id: e.storage_id,
      storage_name: 'hurtownia',
      price_netto_buy:0,
      price_brutto_buy:0,
      price_netto_sell: e.price_brutto / (1 + e.tax_rate / 100),
      price_brutto_sell: e.price_brutto,
      tax_rate: e.tax_rate,
      quantity: e.quantity,
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



async function loadOrders () {
  const date = await convertToUnixTimestamp(2021,12,28)
  const data = await getOrders(token, date)
  // data.forEach((e) => {
  //   createOrder(convertOrder(e))
  // })
  createOrder(convertOrder(data[0]))
}

loadOrders();

