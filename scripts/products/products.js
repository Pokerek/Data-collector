const mongoose = require('../database/mongoose')
const fs = require("fs");

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  ean: String,
  storage_id: Number,
  storage_name: String,
  price: {
    buy: {
      netto: [Number],
      brutto: [Number]
    },
    sell: {
      netto: [Number],
      brutto: [Number]
    }
  },
  tax_rate: Number,
  profit: Number,
  lastSell: Number,
})

const Product = mongoose.model('Product', productSchema)

const products = {
  async create (product) {
    await new Product(product).save()
  },
  convert (product) {
    return {
      name: product.name,
      sku: product.sku,
      ean: product.ean,
      storage_id: product.storage_id,
      storage_name: product.storage_name,
      price: {
        buy: {
          netto: [product.price.buy.netto || 0],
          brutto: [product.price.buy.brutto || 0]
        },
        sell: {
          netto: [product.price.sell.netto],
          brutto: [product.price.sell.brutto]
        }
      },
      tax_rate: product.tax_rate,
      profit: product.profit,
      lastSell: new Date().getTime()
    }
  },
  async update (product) {
    const dbProduct =  await Product.findOne({ean: product.ean, sku: product.sku})
    const localProduct = this.convert(product)
    if (dbProduct) { // Update information
      dbProduct.storage_name = localProduct.storage_name
      dbProduct.price.buy.netto = this.maxMemory(dbProduct.price.buy.netto,localProduct.price.buy.netto[0])
      dbProduct.price.buy.brutto = this.maxMemory(dbProduct.price.buy.brutto,localProduct.price.buy.brutto[0])
      dbProduct.price.sell.netto = this.maxMemory(dbProduct.price.sell.netto,localProduct.price.sell.netto[0])
      dbProduct.price.sell.brutto = this.maxMemory(dbProduct.price.sell.brutto,localProduct.price.sell.brutto[0])
      dbProduct.profit = localProduct.profit
      dbProduct.lastSell = localProduct.lastSell
      await dbProduct.save()
    } else { 
      await this.create(localProduct) // Create new product
    }
  },
  testEAN (productEAN, array = []) {
    return productEAN !== '' && !array.find(({ean}) => ean === productEAN)
  },
  testSKU (productSKU, array = []) {
    return (productSKU !== '') && (!array.find(({sku}) => sku === productSKU))
  },
  testOUTLET (productSKU) {
    return (productSKU.indexOf('OUTLET') !== -1) || (productSKU.indexOf('ZWROT') !== -1)
  },
  maxMemory (array, price, max = 5) {
    if(array.length === max) {array.shift()}
    array.push(price)
    return array
  }
}

module.exports = products