const mongoose = require('./mongoose')
const baselinker = require('../baselinker/baselinker')

const statusSchema = new mongoose.Schema({
  id: String,
  name: String
})

const Status = mongoose.model('Status', statusSchema)

async function createStatus(data) {
  const status = new Status(data)
  await status.save()
}

function convertStatus(status) {
  return {
    id: status.id,
    name: status.name
  }
}


async function loadStatus () {
  return await baselinker.getOrderStatusList()
}

async function updateStatus () {
  const data = await loadStatus()
  for (let index in data) {
    const status = await statusExist((data[index]).id)
    if(status) {
      const newStatus = convertStatus(data[index])
      status.name = newStatus.name
      status.type = newStatus.type
      status.save()
    } else {
      createStatus(convertStatus(data[index]))
    }
  }
}

async function statusExist(id) {
  const status = await Status.find({id: id})
  return status[0]
}