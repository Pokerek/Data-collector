const fs = require("fs");

const missedList = {
  bufor: [],
  add(product,info = '') {
    product.info = info
    this.bufor.push(product)
  },
  async save() {
    const actualDate = `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
    let saveString = ''

    this.bufor.forEach((product) => {
      saveString += `Name: ${product.name} | SKU: ${product.sku} | EAN: ${product.ean} | Storage: ${product.storage_name} | ${product.info} \n`
    })
    
    fs.writeFileSync(`../logs/missedList/${actualDate}.txt`, saveString)
  }
}

module.exports = missedList