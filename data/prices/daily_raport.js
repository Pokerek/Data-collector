const { get } = require('express/lib/response');
const mongoose = require('../connect');
const check_taxes = require('../allegro/check_taxes')
const orders = require('../orders')
const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const dailyRaportSchema = new mongoose.Schema({
    data_raportu: String,
    godzina_raportu: String,
    zysk_całkowity: Number,
    zysk_z_outletu: Number,
    waluta: String
})

const dailyRaport = mongoose.model('daily_raport', dailyRaportSchema)

const userTokenSchema = new mongoose.Schema({
    token: String,
    refresh_token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const userToken = mongoose.model('user_token', userTokenSchema);
    
const orderSchema = new mongoose.Schema({
    order_id: Number,
      date_confirmed: Number,
      date_in_status: Number,
      admin_comments: String,
      delivery_method: String,
    delivery_price: Number,
      products: [{
              name: String,
              sku: String,
              ean: String,
        storage_id: Number,
              storage_name: String,
        price: {
          buy: {
            netto: Number,
            brutto: Number
          },
          sell: {
            netto: Number,
            brutto: Number
          }
        },
              tax_rate: Number,
              quantity: Number,
        profit: Number,
              location:String,
              auction_id: String
    }]
})
  
const Order = mongoose.model('Order', orderSchema)

const daily_raport={

    data_raportu: '',
    godzina_raportu: '',
    zysk_całkowity: '',
    zysk_z_outletu: '',
    waluta: '',  

    async createDailyRaport()
    {
        const today = new Date()
        this.data_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth() + "." + today.getFullYear(); 
        this.godzina_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=orders.getProfitFromOutlet();
        this.zysk_całkowity=await orders.getProfitFromOrders()-await check_taxes.getAllegroBillingsTotalOutcome();
        this.waluta = 'zł'

        return this;
    },
}




