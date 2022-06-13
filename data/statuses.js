const mongoose = require('./database/mongoose')
const baselinker = require('./baselinker')

const statusSchema = new mongoose.Schema({
  status_id: String,
  name: String
})

const Status = mongoose.model('Status', statusSchema)

async function createStatus(data) {
  const status = new Status(data)
  await status.save()
}

function convertStatus(status) {
  return {
    status_id: status.id,
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
  const status = await Status.find({status_id: id})
  return status[0]
}

module.exports = updateStatus