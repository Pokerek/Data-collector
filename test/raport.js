const raport = require('../scripts/prices/raport')

const testRaport = async() => {
  const raportObject = await raport.create(2022,01,30)
  console.log(raportObject)
}

testRaport()