const mongoose = require('mongoose')

const Storage = mongoose.model('Storage', new mongoose.Schema({
  storage_id: [Number],
  name: String
}))

module.exports = Storage