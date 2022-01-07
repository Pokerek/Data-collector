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

const daily_raport={

    data_raportu: '',
    godzina_raportu: '',
    zysk_całkowity: '',
    zysk_z_outletu: '',
    waluta: '',  

    async createDailyRaport(month, day)
    {
        const today = new Date()
        this.data_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth() + "." + today.getFullYear(); 
        this.godzina_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=await orders.getProfitFromOutlet(month, day);
        this.zysk_całkowity=await orders.getProfitFromOrders(month, day)-await check_taxes.getAllegroBillingsTotalOutcome();
        this.waluta = 'zł'

        this = new dailyRaport(this);
        this.save();
    },
}

module.exports=daily_raport;




