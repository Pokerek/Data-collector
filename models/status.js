const mongoose = require('mongoose')

const Status = mongoose.model('Status', new mongoose.Schema({
  id: Number,
  name: String
}))

module.exports = Status