const deliveryCost = require('./deliveryCost')

const profit = {
  fromOrders(orders) {
    let profit = 0;
    for(const order of orders) {
      profit += order.profit;
    }
    return profit.toFixed(2) * 1;
  },
  toProduct(productPrice, vat, provision = 0.12) {
    if(vat > 1) {vat = (vat / 100)}
    const allegroCost = productPrice.sell.brutto * provision,
          allegroVat = (allegroCost / (1.23)) * 0.23,
          productVat = (productPrice.sell.netto - productPrice.buy.netto) * vat
    return (productPrice.sell.brutto - allegroCost + allegroVat - productVat - productPrice.buy.netto).toFixed(2) * 1
  },
  toOrder(order) {
    order.products.forEach(product => {
      order.profit += product.profit
    })
    const deliveryTotal = order.delivery.price - order.delivery.cost,
          deliveryVat = (deliveryTotal / 1.23 * 0.23).toFixed(2) * 1
    return (order.profit + (deliveryTotal - deliveryVat)).toFixed(2) * 1 
  },
  toDeliveryCost(order) {
    let total = 0
    order.products.forEach(product => {
      total += product.price.sell.brutto
    })
    total = total.toFixed(2) * 1
    
    let allegroCost = 0
    if(order.delivery.price && order.delivery.price !== 3.99) {
      allegroCost = deliveryCost[order.delivery.method]['0']
    } else if(total < 80) {
      allegroCost = deliveryCost[order.delivery.method]['40']
    } else if (total < 200) {
      allegroCost = deliveryCost[order.delivery.method]['80']
    } else if (total < 300) {
      allegroCost = deliveryCost[order.delivery.method]['200']
    } else if (total >= 300) {
      allegroCost = deliveryCost[order.delivery.method]['300']
    }
    return allegroCost
  }
}

module.exports = profit