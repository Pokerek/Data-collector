const mongoose = require('mongoose')

const Storage = mongoose.model('Storage', new mongoose.Schema({
  storage_id: String,
  name: String,
  type: String
}))

module.exports = Storage