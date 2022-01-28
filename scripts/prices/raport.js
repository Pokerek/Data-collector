const orders = require('../products/orders')
const outlet = require('../products/outlet')
const profit = require('./profit')

const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const raport = {

    async create(year, month, day, period) {
        const periodNumber = this.periodToNumber(period) 
        const time = 86400000 * periodNumber
        const loadOrders = await orders.load(year, month, day, time / 1000);
        return {
            date: {
               created: new Date(),
               period: periodNumber,
               started: new Date(year, month - 1, day,1),
               ended: new Date(new Date(year, month - 1, day,1) + time)
            },
            profit: {
                type: 'zł',
                //outlet: await outlet.getProfitFromOutlet(year, month, day),
                sell: profit.fromOrders(loadOrders),
                //cancelled: await orders.getLossFromCancellations(year, month, day)
            },
            total: this.total(loadOrders),
        }
    },

    periodToNumber(period){
        switch (period) {
            case 'daily':
            case '1':
                return 1
            default:
                return period * 1
        }
    },

    total(orders) {
        let sell = 0, buy = 0, delivery = 0
        for(const order of orders) {
            delivery += order.delivery.price
            for(const product of order.products) {
                if(product.storage_name !== 'OUTLET') {
                    sell += product.price.sell.brutto
                    buy += product.price.buy.brutto
                }
            }       
        }
        return {
            sell: sell.toFixed(2) * 1,
            buy: buy.toFixed(2) * 1,
            delivery: delivery.toFixed(2) * 1
        }
    }
}

module.exports=raport;




