const baselinker = require('../../baselinker')
const products = require('../products')
const Order = require('../../../models/order')
const orders = require('./index')
const fs = require("fs/promises");
const statuses = require('../statuses')


const cart = {
  orders: [],
  products: [],
  async loadOrders() {
    const orders = await Order.find({comments: /.*NOWE.*/}).populate('status','name -_id')
    const newStatus = await statuses.getNewArray()
    for(const order of orders) {
      if(newStatus.includes(order.status.name)) { this.orders.push(order) }
    }
  },
  productExist(source,company,product) {
    const array = this.products[source][company][product.storage]
    for(const index in array) {
      const el = array[index]
      if(el.ean === product.ean && el.sku === product.sku) return index
    }
    return -1
  },
  async sortProducts() {
    for(const order of this.orders) {
      for(const product of order.products) {
        if(product.location !== '') continue
        const details = await products.getDetails(product.product)
        
        //create container
        if(!this.products[order.source]) { this.products[order.source] = [] }
        if(!this.products[order.source][order.company]) { this.products[order.source][order.company] = [] }
        if(!this.products[order.source][order.company][details.storage]) {this.products[order.source][order.company][details.storage] = []}
         
        const index = this.productExist(order.source,order.company,details)
        if(index !== -1) {
          this.products[order.source][order.company][details.storage][index].quantity += product.quantity.actual
        } else this.products[order.source][order.company][details.storage].push({
          name: details.name,
          ean: details.ean,
          sku: details.sku,
          price: product.price,
          quantity: product.quantity.actual
        })
      }
    }
  },
  async updateBL () {
    for(const order of this.orders) {
      const dbOrder = await Order.findOne({order_id: order.order_id})
      await baselinker.setOrderStatus(dbOrder.order_id,289436) //Orders to POBRANE
      dbOrder.status = await statuses.getById(289436)
      for(const index in dbOrder.products) {
        const details = await products.getDetails(dbOrder.products[index].product)
        dbOrder.products[index].location = details.storage //save location
        await baselinker.setOrderProductFields(dbOrder.order_id,dbOrder.products[index].bl_id,dbOrder.products[index].location) //Save location to bl
      }
      await dbOrder.save()
    }
  },
  async create() {
    //clear all
    this.orders = []
    this.products = []
    let finalString = ''
    const today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
    
    //load actual orders
    await orders.updateFromData(today.year, today.month, today.day)

    //load orders
    await this.loadOrders()

    //sort products
    await this.sortProducts()
    //create list
    for(const source in this.products) {
      finalString += `${source}\n\n`
      for(const company in this.products[source]) {
        finalString += ` ${company} ---------\n\n`
        for(const storage in this.products[source][company]) {
          if(storage.includes('OUTLET')) continue
          finalString += `  ${storage}\n`
          for(const product of this.products[source][company][storage]) {
            finalString += `   EAN: ${product.ean} | SKU: ${product.sku} | ILOŚĆ: ${product.quantity} | NAZWA: ${product.name.substring(0,50)} | CENA: ${product.price.sell.brutto}\n`
          }
          finalString += `\n`
        }
      }
      finalString += `\n`
    }

    //Save file
    await fs.writeFile(`./logs/lists/${today.day}-${today.month}-${today.year}.txt`,finalString)

    //Update baselinker
    //await this.updateBL()
  }
}

module.exports = cart