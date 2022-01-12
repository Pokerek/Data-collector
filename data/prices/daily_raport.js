const mongoose = require('../connect');
const check_taxes = require('../allegro/check_taxes')
const orders = require('../orders')
const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const dailyRaportSchema = new mongoose.Schema({
    data_raportu: String,
    godzina_raportu: String,
    zysk_z_outletu: Number,
    zysk_całkowity: Number,
    waluta: String
})

const dailyRaport = mongoose.model('daily_raport', dailyRaportSchema)

const daily_raport={

    data_raportu: '',
    godzina_raportu: '',
    zysk_z_outletu: '',
    zysk_całkowity: '',
    waluta: '',  

    async createDailyRaport(year, month, day)
    {
        const today = new Date()
        this.data_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth()+1 + "." + today.getFullYear(); 
        this.godzina_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=await orders.getProfitFromOutlet(year, month, day);
        this.zysk_całkowity=(await orders.getProfitFromOrders(year, month, day)-await check_taxes.getAllegroBillingsTotalDailyOutcome()).toFixed(2)*1;
        this.waluta = 'zł'

        new dailyRaport(this).save();
    },
}

module.exports=daily_raport;




