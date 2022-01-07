const mongoose = require('../connect');
const check_taxes = require('../allegro/check_taxes')
const orders = require('../orders')
const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const dailyRaportSchema = new mongoose.Schema({
    data_raportu: String,
    godzina_raportu: String,
    zysk_całkowity: Number,
    zysk_z_outletu: Number,
    strata_z_anulacji: Number,
    waluta: String
})

const dailyRaport = mongoose.model('daily_raport', dailyRaportSchema)

const complete_daily_raport={

    data_raportu: '',
    godzina_raportu: '',
    zysk_całkowity: 0,
    zysk_z_outletu: 0,
    strata_z_anulacji: 0,
    waluta: '',  

    async createDailyRaport(month, day)
    {
        const today = new Date()
        this.data_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth() + "." + today.getFullYear(); 
        this.godzina_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=await orders.getProfitFromOutletWithCancellations(month, day);
        this.zysk_całkowity=await orders.getProfitFromOrdersWithCancellations(month, day)-await check_taxes.getAllegroBillingsTotalOutcome();
        this.strata_z_anulacji=await orders.getLossFromCancellations(month, day)
        this.waluta = 'zł'

        this = new dailyRaport(this);
        this.save();
    },
}

module.exports=complete_daily_raport;