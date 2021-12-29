//Database connect
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/silesiaDB')
  .then(() => console.log('Connect to DB.'))
  .catch(err => console.error('Could not connect to MongoDB...', err))
  
module.exports = mongoose