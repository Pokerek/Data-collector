const mongoose = require('./connect')

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  ean: String,
  storage_id: Number,
  storage_name: String,
  price_netto_buy: [Number],
  price_brutto_buy: [Number],
  price_netto_sell:[Number],
  price_brutto_sell: [Number],
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
      price_netto_buy: [product.price_netto_buy],
      price_brutto_buy: [product.price_brutto_buy],
      price_netto_sell: [product.price_netto_sell],
      price_brutto_sell: [product.price_brutto_sell],
      tax_rate: product.tax_rate,
      profit: product.profit,
      lastSell: new Date().getTime()
    }
  },
  async update (product) {
    const dbProduct =  await this.checkdouble(product)
    const localProduct = this.convert(product)
    if (dbProduct) { // Update information
      dbProduct.storage_name = localProduct.storage_name
      dbProduct.price_netto_buy = this.maxMemory(dbProduct.price_netto_buy,localProduct.price_netto_buy[0])
      dbProduct.price_brutto_buy = this.maxMemory(dbProduct.price_brutto_buy,localProduct.price_brutto_buy[0])
      dbProduct.price_netto_sell = this.maxMemory(dbProduct.price_netto_sell,localProduct.price_netto_sell[0])
      dbProduct.price_brutto_sell = this.maxMemory(dbProduct.price_brutto_sell,localProduct.price_brutto_sell[0])
      dbProduct.profit = localProduct.profit
      dbProduct.lastSell = localProduct.lastSell
      dbProduct.save()
    } else { // Create new product
      this.create(localProduct)
    }
  },
  async checkdouble (product) {
    let dbProduct
    if(this.testEAN(product.ean)) {
      dbProduct = await Product.find({ean: product.ean})
    } else if (this.testSKU(product.sku)) {
      dbProduct = await Product.find({sku: product.sku})      
    }
    return dbProduct[0]
  },
  testEAN (ean) {
    return ean !== ''
  },
  testSKU (sku) {
    return ((sku.indexOf('OUTLET') === -1) && (sku.indexOf('ZWROT') === -1) && sku !== '')
  },
  maxMemory (array, price, max = 5) {
    if(array.length === max) {array.shift()}
    array.push(price)
    return array
  }
}

module.exports = products