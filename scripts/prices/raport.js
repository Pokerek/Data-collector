const profit = require('./profit')

const week_days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota']

const { convertData } = require('../baselinker/baselinker')
const { loadFromDate } = require('../products/orders')

const raport = {

    async create(year, month, day, period = 1) {
        const periodNumber = this.periodToNumber(period),
              startDate = convertData(year, month, day),
              endDate = convertData(year,month,day + period,0,0,-1)
        const loadOrders = (await loadFromDate(startDate, endDate))//.sort((a,b) => (a.order_id > b.order_id) ? 1 : ((a.order_id < b.order_id) ? -1 : 0))
        return {
            date: {
               created: new Date(),
               period: periodNumber,
               started: new Date((startDate + 3600) * 1000),
               ended: new Date((endDate + 3600) * 1000),
            },
            profit: {
                type: 'zł',
                outlet: profit.fromOutlet(loadOrders),
                sell: profit.fromOrders(loadOrders),
                cancelled: profit.fromCancelled(loadOrders)
            },
            total: this.total(loadOrders),
        }
    },

    periodToNumber(period){
        switch (period) {
            case 'daily':
                return 1
            default:
                return period * 1
        }
    },

    total(orders) {
        let sell = 0, buy = 0, delivery = 0, cancellations = 0
        for(const order of orders) {
            if(!order.cancelled) {
                delivery += order.delivery.price
                for(const product of order.products) {
                    if(product.storage_name !== 'OUTLET') {
                        sell += product.price.sell.brutto * product.quantity.actual
                        buy += product.price.buy.brutto * product.quantity.actual
                    }
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




