const Status = require('../../models/status')
const baselinker = require('../../controllers/baselinker')

const statuses = {
  async create(data) {
    await new Status(data).save()
  },
  convert(status) {
    return {
      status_id: status.id,
      name: status.name.toUpperCase()
    }
  },
  async update() {
    const data = await baselinker.getOrderStatusList()
    for (let index in data) {
      const status = await Status.findOne({status_id: (data[index]).id})
      if(status) {
        const newStatus = this.convert(data[index])
        status.name = newStatus.name.toUpperCase()
        status.type = newStatus.type
        status.save()
      } else {
        await this.create(this.convert(data[index]))
      }
    }
  },
  async getById(status_id) {
    let status = await Status.findOne({status_id: status_id})
    if(!status) {
      await this.update()
      status = await Status.findOne({status_id: status_id})
    }
    return status._id
  },
  async getNotOrdered(orderStatus) {
    const statuses = await Status.find().or([{name:/.*NOWE.*/},{name:/.*POBRANE.*/},{name:/.*DROP.*/}])
    return statuses.find(status => status.status_id === orderStatus) ? true : false
  },
  async getCancelled(orderStatus) {
    const statuses = await Status.find({name: /.*ANUL.*/})
    return statuses.find(status => status.status_id === orderStatus) ? true : false
  },
  async getNewArray() {
    const newStatus = []
    for(const status of await Status.find({name: /.*NOWE.*/})) { newStatus.push(status.name) }
    return newStatus
  }
}

module.exports = statuses






