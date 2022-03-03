const mongoose = require('mongoose')

const Status = mongoose.model('Status', new mongoose.Schema({
  status_id: Number,
  name: String
}))

module.exports = Status