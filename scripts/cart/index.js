const baselinker = require('../../controllers/baselinker')

const cart = {
  users: [
    {
      name: 'Karol',
      warehouse: [
        'BOSSOFTOYS',
        'OMBERO',
        'FTOYS',
        'TOYSTORE',
        'TAYMA',
        'GADGETMASTER',
        'PARTNERTELE',
        'HURTEL',
        'DMTRADE',
        'K2',
        'HOMESCREEN',
        'FDDISTRIBUTION',
        'SONIA',
        'EPSTRYK',
        'GIMMIK',
        'SATYA',
        'ECOTRADE',
        'EET'
      ],
      account: [
        {
          name: 'SILESIA',
          warehouse: []
        },
        {
          name: 'FREDIE',
          warehouse: []
        }
      ]
    },
    {
      name: 'Jacek',
      warehouse: [
        'ANNAPOL',
        'ACTION',
        'ECARLA',
        'TOPEX',
        'BENBABY',
        'KINGHOFF',
        'B2BTRADE',
        'VIVAB2B',
        'AMIO',
        'LECHPOL',
        'LAMEX',
        'TELFORCEONE',
        'ORNO',
        'ABONLINE',
        'APTEL',
        'IKS2',
        'COSNET',
        'MAXY',
        'MIKI',
        'SILIT',
        'SEMMA',
        'AMAEUROPE',
        'BABYONO',        
      ],
      account: [
        {
          name: 'SILESIA',
          warehouse: []
        },
        {
          name: 'FREDIE',
          warehouse: []
        }
      ]
    }
  ],
  async getList() {
    const actualDate = `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
    
  },
  async getOrders() {
    
  }
}

module.exports = cart