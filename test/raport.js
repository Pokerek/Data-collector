const raport = require('../scripts/prices/raport')

const testRaport = async() => {
  const raportObject = await raport.create(2022,01,26,2)
  console.log(raportObject)
}

testRaport()