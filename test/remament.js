const remament = require('../scripts/remament')
//const silesiaData = require('../scripts/remament/silesia-data')
//const fhuData = require('../scripts/remament/fhu-data')
//const notFound = require('../scripts/remament/notFound')
const data = require('../scripts/remament/data')


const warehouses = ['SILIT','SONIA','IKS2','APTEL','FDDISTRIBUTION','TELFORCEONE','ABONLINE','ACTION','B2BTRADE','TAYMA','GADGETMASTER','EPSTRYK','DMTRADE','K2','PARTNERTELE','LAMEX','LECHPOL','AMIO','BOSSOFTOYS','FTOYS','TOPEX','ORNO','HURTEL']

const test = async () => {
  await remament.manual('UNKNOWN')
  /*for(const warehouse of warehouses) {
    await remament.manual(warehouse)
  }*/
}

test()