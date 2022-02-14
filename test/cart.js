const baselinker = require('../controllers/baselinker')
const cart = require('../scripts/cart')

const test = async () => {
  const date = baselinker.convertData(2022,01,31)
  await baselinker.getOrders(date)
  await baselinker.getOrderStatusList()
}

//test()