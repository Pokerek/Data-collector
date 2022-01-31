//Database connect
const mongoose = require('mongoose')
require('dotenv').config({path:'../.env'})

const url = process.env.DB_URL 
const localUrl = 'mongodb://localhost/silesiaDB'

const connect = async () => {
  await mongoose.connect(url)
    .then(() => console.log('Connect to DB.'))
    .catch(err => console.error('Could not connect to MongoDB...', err))
}

connect()

  
module.exports = mongoose