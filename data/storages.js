const mongoose = require('./connect')
const baselinker = require('./baselinker')

const storgeSchema = new mongoose.Schema({
  storage_id: String,
  name: String,
  type: String
})

const Storage = mongoose.model('Storage', storgeSchema)

async function createStorage(data) {
  const storage = new Storage(data)
  const result = await storage.save()
}

function convertStorage(storage) {
  return {
    storage_id: storageID(storage),
    name: storage.name,
    type: storageType(storage)
  }
}

function storageID(storage) {
  return storage.storage_id.substring(storage.storage_id.indexOf('_') + 1)
}

function storageType(storage) {
  return storage.storage_id.substring(0,storage.storage_id.indexOf('_'))
}


async function loadStorages () {
  return await baselinker.getStorageList()
}

async function updateStorages () {
  const data = await loadStorages()
  for (let index in data) {
    const storage = await storageExist(storageID(data[index]))
    if(storage) {
      const newStorage = convertStorage(data[index])
      storage.name = newStorage.name
      storage.type = newStorage.type
      storage.save()
    } else {
      createStorage(convertStorage(data[index]))
    }
  }
}

async function storageExist(id) {
  const storages = await Storage.find({storage_id: id})
  return storages[0]
}