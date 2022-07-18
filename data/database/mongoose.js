//Database connect
const mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})

const url = process.env.DB_URL 
const options = {
  
}
// 'mongodb://localhost/silesiaDB'
mongoose.connect('mongodb://localhost/silesiaDB')
  .then(() => console.log('Connect to DB.'))
  .catch(err => console.error('Could not connect to MongoDB...', err))


  
module.exports = mongoose