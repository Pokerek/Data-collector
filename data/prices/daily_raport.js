const mongoose = require('../connect');
const check_taxes = require('../allegro/check_taxes')
const orders = require('../orders')
const outlet = require('../outlet')
const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const dailyRaportSchema = new mongoose.Schema({
    raport_z_dnia:String,
    data_wykonania_raportu: String,
    godzina_wykonania_raportu: String,
    zysk_z_outletu: Number,
    zysk_całkowity: Number,
    waluta: String
})

const dailyRaport = mongoose.model('daily_raport', dailyRaportSchema)

const daily_raport={

    raport_z_dnia:'',
    data_wykonania_raportu: '',
    godzina_wykonania_raportu: '',
    zysk_z_outletu: '',
    zysk_całkowity: '',
    waluta: '',  

    async createDailyRaport(year, month, day)
    {
        const today = new Date()
        const raportDate = new Date(year, month-1, day)
        this.raport_z_dnia=week_days[raportDate.getDay()] + " " + raportDate.getDate() + "." + raportDate.getMonth()+1 + "." + raportDate.getFullYear();
        this.data_wykonania_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth()+1 + "." + today.getFullYear(); 
        this.godzina_wykonania_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=await outlet.getProfitFromOutlet(year, month, day);
        this.zysk_całkowity=(await orders.getProfitFromOrders(year, month, day)-await check_taxes.getAllegroBillingsTotalDailyOutcome()).toFixed(2)*1;
        this.waluta = 'zł'

        new dailyRaport(this).save();
    },
}

module.exports=daily_raport;




