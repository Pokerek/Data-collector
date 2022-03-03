const cart = require('../controllers/database/orders/cart')

const test = async () => {
  await cart.create()
}

test()