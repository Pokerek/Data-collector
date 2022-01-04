const mongoose = require('./connect')

const storgeSchema = new mongoose.Schema({
  storage_id: String,
  name: String,
  type: String
})

const Storage = mongoose.model('Storage', storgeSchema)

const storages = {
  async create(data) {
    const storage = new Storage(data)
    storage.save()
  },
  convert(storage) {
    return {
      storage_id: this.storageID(storage),
      name: storage.name,
      type: this.storageType(storage)
    }
  },
  storageID(storage) {
    return storage.storage_id.substring(storage.storage_id.indexOf('_') + 1)
  },
  storageType(storage) {
    return storage.storage_id.substring(0,storage.storage_id.indexOf('_'))
  },
  async load () {
    return await baselinker.getStorageList()
  },
  async update () {
    const data = await this.load()
    for (let index in data) {
      const storage = await this.exist(this.storageID(data[index]))
      if(storage) {
        const newStorage = this.convert(data[index])
        storage.name = newStorage.name
        storage.type = newStorage.type
        storage.save()
      } else {
        this.create(this.convert(data[index]))
      }
    }
  },
  async exist(id) {
    const storages = await Storage.find({storage_id: id})
    return storages[0]
  },
  async getNames(array) {
    for (index in array) {
      array[index].storage_name = await this.getName(array[index].storage_id)
    }
    return array
  },
  async getName(id) {
    let storages = await Storage.find({storage_id: id})
    if(!storages[0]) {
      await this.update()
      storages = await Storage.find({storage_id: id})
    }
    return storages[0] ? storages[0].name : 'Brak statusu'
  }
}

module.exports = storages
