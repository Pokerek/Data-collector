const mongoose = require('../connect');
const check_taxes = require('../allegro/check_taxes')
const orders = require('../orders')
const outlet = require('../outlet')
const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const completeDailyRaportSchema = new mongoose.Schema({
    data_raportu: String,
    godzina_raportu: String,
    zysk_całkowity: Number,
    zysk_z_outletu: Number,
    strata_z_anulacji: Number,
    waluta: String
})

const completeDailyRaport = mongoose.model('complete_daily_raport', completeDailyRaportSchema)

const complete_daily_raport={

    data_raportu: '',
    godzina_raportu: '',
    zysk_całkowity: 0,
    zysk_z_outletu: 0,
    strata_z_anulacji: 0,
    waluta: '',  

    async createDailyRaport(year, month, day)
    {
        const today = new Date()
        orders.updateFromData(year, month, day)
        this.data_raportu=week_days[today.getDay()] + " " + today.getDate() + "." + today.getMonth()+1 + "." + today.getFullYear(); 
        this.godzina_raportu=today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.zysk_z_outletu=await outlet.getProfitFromOutletWithCancellations(year, month, day);
        this.zysk_całkowity=await orders.getProfitFromOrdersWithCancellations(year, month, day)-await check_taxes.getAllegroBillingsTotalDailyOutcome();
        this.strata_z_anulacji=await orders.getLossFromCancellations(year, month, day)
        this.waluta = 'zł'

        new completeDailyRaport(this).save();
    },
}

module.exports=complete_daily_raport;