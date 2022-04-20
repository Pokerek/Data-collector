const express = require('express');
const router = express.Router()
const fs = require("fs/promises")

const cart = require('../../controllers/database/orders/cart')

const checkFileExists = async (file) => {
  return await fs.access(file).then(() => true).catch(() => false)
}

router.get('/generate', async function(req, res, next) {
  const actualDate = `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
  const path = `./logs/lists/${actualDate}.txt`
  if(!await checkFileExists(path)) {
    if(!cart.checkStatus()) cart.create()
    res.send('List is preparing. Please wait.')
  } else res.download(path)
})

module.exports = router
