const price = require('../prices')
const Remament = require('./model')
const missedList = require('../logs/missedList')
const prompts = require('prompts')
//const fhuData = require('./fhu-data')

const remament = {
  async create(data) {
    const remament = new Remament(data)
    await remament.save()
  },
  convert(remament) {
    return {
      name: remament.name,
      storage: this.setStorage(remament),
      sku: this.setSKU(remament),
      ean: remament.ean,
      tax_rate: 23,
      price: {
        buy: {
          netto: 0,
          brutto: 0
        }
      }
    }
  },
  async save(data) {
    for (const remament of data) {
      if(!await Remament.findOne({ean: remament.ean})) {
        await this.create(this.convert(remament))
      }
    }
  },
  setSKU (remament) {
    if (remament.sku) {
      if(remament.storage_name === 'ANNAPOL') {
        return remament.sku
          .replaceAll('LEC-','')
          .replaceAll('OR-','')
          .replaceAll('AMI-','')
          .replaceAll('TOP-','')
      } else {
        return remament.sku
      }
    } else {
      return ''
    }
  },
  setStorage(remament) {
    if (remament.storage) {
      if(remament.storage_name === 'OMBERO')
        return 'BOSSOFTOYS'
      if(remament.storage_name === 'ANNAPOL') {
        if(remament.sku.includes('LEC-')) {
          return 'LECHPOL'
        } else if (remament.sku.includes('OR-')) {
          return 'ORNO'
        } else if (remament.sku.includes('AMI-')) {
          return 'AMIO'
        } else if (remament.sku.includes('TOP-')) {
          return 'TOPEX'
        } else {
          return 'ANNAPOL'
        }
      }
      return remament.storage_name
    } else {
      return 'UNKNOWN'
    }
    
  },
  async get(storageName) {
    return await Remament.find({storage: storageName, 'price.buy.netto': {$lte: 0}})
  },
  async update(remament) {
    if(remament.price.buy.netto) {
      await Remament.findOneAndUpdate({ean: remament.ean},{price: remament.price})
    }
  },
  async search(storageName) {
    let remaments = await this.get(storageName)
    remaments = await price.getPrices(remaments,storageName,true)
    if(remaments.length) {
      for(const remament of remaments) {
        await this.update(remament)
      }
      missedList.save(`R-${storageName}`)
    } else {
      console.log(`${storageName} - clear`)
    }
  },
  async manual(storageName) {
    let remaments = await this.get(storageName)
    let max = remaments.length, position = 1
    if(remaments.length) {
      for (const remament of remaments) {
        console.log(`${position} / ${max} | ${remament.storage} | EAN: ${remament.ean} | SKU: ${remament.sku} | Name: ${remament.name}`)
        const userData =  await prompts([{
          type: 'number',
          name: 'cost',
          message: 'Write price: '
        },
        {
          type: 'number',
          name: 'netto',
          message: 'Is netto (True - 1 / False - 0): ',
          min: 0,
          max: 1
        }])
        userData.cost /= 100 // Fix price
        remament.price = {
          buy: {
            netto: userData.netto ? userData.cost : price.nettoPrice(userData.cost,remament.tax_rate),
            brutto: userData.netto ? price.bruttoPrice(userData.cost,remament.tax_rate) : userData.cost
          }
        }
        position++
        await this.update(remament)
      }
    }
  },
  async killDouble() {
    const remaments = await Remament.find({'price.buy.netto': {$lte: 0}})
    for(const remament of remaments) {
      const data = await Remament.find({ean: remament.ean})
      if(data.length > 1) {
        await Remament.findByIdAndRemove({_id: remament._id})
      }
    }
  }
}

module.exports = remament