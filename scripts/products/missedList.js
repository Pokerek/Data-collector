const fs = require("fs");

const missedList = {
  bufor: [],
  add(product,info = '') {
    product.info = info
    this.bufor.push(product)
  },
  async save(name) {
    const actualDate = new Date()
    const fileName = `${name}-${actualDate.getDate()}-${actualDate.getMonth()+1}-${actualDate.getFullYear()}-${actualDate.getHours()}-${actualDate.getMinutes()}`
    let saveString = ''

    this.bufor.forEach((product) => {
      saveString += `Name: ${product.name} | SKU: ${product.sku} | EAN: ${product.ean} | Storage: ${product.storage_name} | ${product.info} \n`
    })
    
    fs.writeFileSync(`../logs/missedList/${fileName}.txt`, saveString)
  }
}

module.exports = missedList