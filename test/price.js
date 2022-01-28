const prices = require('../scripts/prices/prices')
const profit = require('../scripts/prices/profit')
const deliveryCost = require('../scripts/prices/deliveryCost')

console.log(profit.toProduct({buy: {netto: 19.2, brutto: 23.62}, sell: {netto:27.63, brutto: 33.99}},23))

