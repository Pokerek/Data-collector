const raport = require('../scripts/prices/raport')

const testRaport = async() => {
  const raportObject = await raport.create(2022,01,20,'daily')
  console.log(`Marża: ${(raportObject.profit.sell * 100 / raportObject.buy).toFixed(2)}%`)
  console.log(raportObject)
}

testRaport()