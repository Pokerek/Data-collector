const mongoose = require('mongoose')

const Remament = mongoose.model('Remament', new mongoose.Schema({
  name: String,
  sku: String,
  ean: String,
  tax_rate: Number,
  price: {
    buy: {
      netto: Number,
      brutto: Number
    }
  },
  storage: String,
}))

module.exports = Remament