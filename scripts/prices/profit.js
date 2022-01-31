const deliveryCost = require('./deliveryCost')

const profit = {
  fromOrders(orders) {
    let profit = 0;
    for(const order of orders) {
      profit += order.profit;
    }
    return profit.toFixed(2) * 1
  },
  fromOutlet(orders) {
    let profit = 0;
    for(const order of orders) {
      for (const product of order.products) {
        if(product.storage_name === 'OUTLET') {profit += product.price.sell.brutto * product.quantity.actual}
      }
    }
    return profit.toFixed(2) * 1
  },
  fromCancelled(orders) {
    let profit = 0;
    for(const order of orders) {
      if(order.ordered) {
        if(order.cancelled) {
          for (const product of order.products) {
            if(product.storage_name !== 'OUTLET') {profit += product.price.buy.brutto * product.quantity.actual}
          }
        } else {
          for (const product of order.products) {
            if(product.quantity.returned) {profit += product.price.buy.brutto * product.quantity.returned}
          }
        }
      }
    }
    return profit.toFixed(2) * 1
  },
  toProduct(productPrice, vat, provision = 0.12,tax = 0.09) {
    if(vat > 1) {vat = (vat / 100)}
    const allegroCost = productPrice.sell.brutto * provision,
          allegroTax = (allegroCost / (1.23)) * (0.23 + tax),
          productTax = (productPrice.sell.netto - productPrice.buy.netto) * (vat + tax)
    return (productPrice.sell.brutto - allegroCost + allegroTax - productTax - productPrice.buy.brutto).toFixed(2) * 1
  },
  toOrder(order,tax = 0.09) {
    order.profit = 0
    if(!order.cancelled) {
      order.products.forEach(product => {
        order.profit += product.profit * product.quantity.actual
      })
    }
    const deliveryTotal = order.delivery.price - order.delivery.cost,
          deliveryTax = (deliveryTotal / 1.23 * (0.23 + tax)).toFixed(2) * 1
    return (order.profit + (deliveryTotal - deliveryTax)).toFixed(2) * 1 
  },
  toDeliveryCost(order,provision = 0.12) {
    let total = 0
    order.products.forEach(product => {
      total += product.price.sell.brutto
    })
    total = total.toFixed(2) * 1
    let cost = 0
    if(deliveryCost.hasOwnProperty(order.delivery.method)) {
      if(order.delivery.price && order.delivery.price !== 3.99) {
        cost = deliveryCost[order.delivery.method]['0'] 
      } else if(total < 80) {
        cost = deliveryCost[order.delivery.method]['40']
      } else if (total < 200) {
        cost = deliveryCost[order.delivery.method]['80']
      } else if (total < 300) {
        cost = deliveryCost[order.delivery.method]['200']
      } else if (total >= 300) {
        cost = deliveryCost[order.delivery.method]['300']
      }
    } else {
      cost = order.delivery.price
    }
    return cost
  }
}

module.exports = profit