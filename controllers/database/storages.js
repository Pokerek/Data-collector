const Storage = require('../../models/storage') 
const baselinker = require('../baselinker')

const storages = {
  outlet_id: [1154,380,25754],
  async create(data) {
    await new Storage(data).save()
  },
  convert(storage) {
    return {
      storage_id: [this.storageID(storage)],
      name: storage.name,
    }
  },
  storageID(storage) {
    return storage.storage_id.substring(storage.storage_id.indexOf('_') + 1) * 1
  },
  prepareName(name) {
    name = name.substring(name.indexOf(' ') + 1)
    return name.substring(name.indexOf(' ') + 1)
  },
  async update (storage_id) {
    // storages
    const storages = await baselinker.getStorageList()
    for (let index in storages) { await this.add(this.storageID(storages[index]),this.prepareName(storages[index].name)) }
    // inventories

    const inventories = await baselinker.getInventories()
    for (let index in inventories) { await this.add(inventories[index].inventory_id,this.prepareName(inventories[index].name)) }
    
    //Safety function
    if(!(await Storage.findOne({storage_id: storage_id}))) {
      await this.create({
        storage_id: storage_id,
        name: storage_id,
      })
    }
  },
  async add(id,name) {
    if(this.outlet_id.includes(id)) {
      const outlet = await Storage.findOne({name: 'OUTLET'})
        if(outlet && !outlet.storage_id.includes(id)) { 
          outlet.storage_id.push(id)
          await outlet.save()
        } 
        else {
          await this.create({
            storage_id: [id],
            name: 'OUTLET'
          })
        }
    } else {
      const storage = await Storage.findOne({name: name})
      if(storage && !storage.storage_id.includes(id)) {
        storage.storage_id.push(id) 
        await storage.save()
      } else {
        await this.create({
          storage_id: [id],
          name: name
        })
      }
    }
  },
  async getById(storage_id) {
    let storage = await Storage.findOne({storage_id})
    if(!storage) { //Update list and find again
      await this.update(storage_id)
      storage = await Storage.findOne({storage_id})
    }
    return storage._id
  }
}

module.exports = storages
