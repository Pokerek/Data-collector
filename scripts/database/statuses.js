const Status = require('../../models/status')
const baselinker = require('../../controllers/baselinker')

const statuses = {
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
  async update() {
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
  },
  async get(status_id) {
    let status = await Status.findOne({id: status_id})
    if(!status) {
      await this.update()
      status = await Status.findOne({id: status_id})
    }
    return status._id
  }
}

module.exports = statuses






