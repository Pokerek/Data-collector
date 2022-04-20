const mongoose = require('mongoose')

const Order = mongoose.model('Order', new mongoose.Schema({
  order_id: Number,
  comments: String,
  profit: Number,
  cancelled: Boolean,
  notOrdered: Boolean,
  source: String,
  company: String,
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status'
  },
  date: {
    add: Number,
    confirmed: Number,
    status: Number
  },
	delivery: {
    method: String,
    price: Number,
    cost: Number,
    returned: Boolean,
    smart: Boolean
  },
  products: [
    new mongoose.Schema({
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
      quantity: {
        actual: Number,
        returned: Number
      },
      profit: Number,
      location: String,
      auction_id: String,
      bl_id: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',   
      }
    }
  )]
}))

module.exports = Order