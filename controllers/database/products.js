const Product = require('../../models/product')
const storages = require('./storages')
const prices = require('../prices')
const profit = require('../prices/profit')

const products = {
  productsBuffor: [],
  totalStorage: 0,
  startSearch: true,
  async create (data) {
    const product = new Product(data)
    product.save()
    return product
  },
  async convert (product) {
    return {
      name: product.name,
      sku: product.sku,
      ean: product.ean,
      tax_rate: product.tax_rate,
      lastSell: new Date().getTime(),
      price: [{
        buy: {
          netto: 0,
          brutto: 0
        }, 
        sell: {
          netto: prices.nettoPrice(product.price_brutto,product.tax_rate),
          brutto: product.price_brutto
        }
      }],
      storage: await storages.getById(product.storage_id)
    }
  },
  async update (product) {
    await Product.findOneAndUpdate({ean: product.ean, sku: product.sku},{price:product.price})
  },
  async load(product) {
    if(this.startSearch) {
      this.startSearch = false,
      this.productsBuffor = []
      this.totalStorage = 0
    }
    let dbProduct = await Product.findOne({ean: product.ean,sku: product.sku})
    if(dbProduct)  {
      const newPrice = {
        buy: {
          netto: 0,
          brutto: 0
        },
        sell: {
          netto: prices.nettoPrice(product.price_brutto,product.tax_rate),
          brutto: product.price_brutto
        }
      }
      dbProduct.lastSell = new Date().getTime()
      if(dbProduct.price[0].sell.brutto < newPrice.sell.brutto) {
        dbProduct.price = this.maxMemory(dbProduct.price,newPrice)
      }
      await dbProduct.save()
    } else { dbProduct = await this.create(await this.convert(product)) } 
    await this.add(dbProduct)
    return {
      price: dbProduct.price[0],
      quantity: {
        actual: product.quantity,
        returned: 0
      },
      profit: 0,
      location: product.location,
      auction_id: product.auction_id,
      bl_id: product.order_product_id,
      product: dbProduct._id
    }
  },
  async updateInOrder(dbProduct,products) {
    let notExist = true
    for(const index in products) {
      const product = products[index]
      if(dbProduct.ean === product.ean && dbProduct.auction_id === product.auction_id) {
        if(dbProduct.quantity.actual > product.quantity) { //quantity update
          product.quantity.returned = product.quantity.actual - product.quantity
        } else if (dbProduct.quantity.actual < product.quantity) {
          dbProduct.quantity.returned -= product.quantity - dbProduct.quantity.actual
          if(dbProduct.quantity.returned < 0) {dbProduct.quantity.returned = 0}
        }
        dbProduct.quantity.actual = product.quantity

        dbProduct.price.sell = {
          netto: prices.nettoPrice(product.price_brutto,product.tax_rate),
          brutto: product.price_brutto
        }
        dbProduct.location = product.location
        dbProduct.ean = product.ean
        dbProduct.sku = product.sku
        dbProduct.profit = profit.toProduct(dbProduct.price,product.tax_rate) //recalculate profit form product
        return dbProduct // back to order
      }
      if(index === (products.length - 1) && notExist) return 'notExist' // Not exist
    }
    return 'notFound' // Not found
  },
  async add(product) {
    await product.populate('storage', 'name -_id') //Get storage name
    const storageName = product.storage.name
    if (this.testOUTLET(product.sku)) { // grab outlet
      //outletBuffor.push(product)
    } else if(this.productsBuffor[storageName]) { // add product to array o storage
      if(this.testEAN(product.ean,this.productsBuffor[storageName]) || this.testSKU(product.sku,this.productsBuffor[storageName])) { //Test ean or sku
        this.productsBuffor[storageName].push(product)
      }
    } else { // create array for storage
      this.productsBuffor[storageName] = []
      this.productsBuffor[storageName].push(product)
      this.totalStorage++
    }
  },
  async findPrices() {
    let count = 1 
    this.startSearch = true
    for(const storage in this.productsBuffor) { //Loop for storages
      console.log(`Progress (${(count * 100 / this.totalStorage).toFixed(1)}%) > ${count}. ${storage} <`)
      this.productsBuffor[storage] = await prices.getPrices(this.productsBuffor[storage],storage,true) //Prices load from storages
      for(const product of this.productsBuffor[storage]) {
        await this.update(product) 
      }
      count++
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
  maxMemory (array, element, max = 5) {
    if(array.unshift(element) > max) {array.pop()}
    return array
  },
  async getDetails(id) {
    const product = await Product.findById(id).populate('storage','name -_id')
    return {
      name: product.name,
      ean: product.ean,
      sku: product.sku,
      price: product.price[0],
      tax_rate: product.tax_rate,
      storage: product.storage.name
    }
  }
}

module.exports = products
