const orders = require('../products/orders')
const outlet = require('../products/outlet')
const profit = require('./profit')

const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const raport = {

    async create(year, month, day, period) {
        const periodNumber = this.periodToNumber(period) 
        const time = 86400 * periodNumber
        const loadOrders = await orders.load(year, month, day, time);
        return {
            date: {
               created: new Date(),
               period: periodNumber,
               started: new Date(year, month - 1, day,1)
            },
            profit: {
                type: 'zł',
                //outlet: await outlet.getProfitFromOutlet(year, month, day),
                sell: profit.fromOrders(loadOrders),
                //cancelled: await orders.getLossFromCancellations(year, month, day)
            },
            sell: this.total(loadOrders,'sell'),
            buy: this.total(loadOrders,'buy'),
        }
    },

    periodToNumber(period){
        switch (period) {
            case 'daily':
            case '1':
            default:
                return 1
        }
    },

    total(orders,type) {
        let total = 0;
        for(const order of orders) {
            for(const product of order.products) {
                if(type === 'sell') {total += product.price.sell.brutto} else {total += product.price.buy.brutto}
            }
        }
        return total.toFixed(2) * 1
    }
}

module.exports=raport;




