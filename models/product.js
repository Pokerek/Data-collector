const mongoose = require('mongoose')

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  sku: String,
  ean: String,
  tax_rate: Number,
  lastSell: Number,
  price: [{
    buy: {
      netto: Number,
      brutto: Number
    },
    sell: {
      netto: Number,
      brutto: Number
    },
  }],
  storage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage'
  }
}))

module.exports = Product