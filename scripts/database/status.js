const mongoose = require('./mongoose')
const baselinker = require('../baselinker/baselinker')

const statusSchema = new mongoose.Schema({
  id: String,
  name: String
})

const Status = mongoose.model('Status', statusSchema)


const status = {
  async create(data) {
    const status = new Status(data)
    await status.save()
  },
  convert(status) {
    return {
      id: status.id,
      name: status.name
    }
  },
  async update () {
    const data = await baselinker.getOrderStatusList()
    for (let index in data) {
      const status = await Status.findOne({id: (data[index]).id})
      if(status) {
        const newStatus = this.convert(data[index])
        status.name = newStatus.name
        status.type = newStatus.type
        status.save()
      } else {
        await this.create(this.convert(data[index]))
      }
    }
    console.log(`Statuses updated.`)
  }
}

module.exports = status






