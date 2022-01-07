const mongoose = require('./connect')
const baselinker = require('./baselinker')
const products = require('./products')
const storages = require('./storages')
const prices = require('./prices/prices')

const orderSchema = new mongoose.Schema({
  order_id: Number,
	date_confirmed: Number,
	date_in_status: Number,
	admin_comments: String,
	delivery_method: String,
  delivery_price: Number,
  cancelled: Boolean,
  delivery_price_returned: Boolean,
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
			location: String,
			auction_id: String,
  }]
})

const Order = mongoose.model('Order', orderSchema)

const nettoPrice = (brutto,tax, place = 2) => {
  return (brutto / (1 + tax / 100)).toFixed(place) * 1
}

const orders = {
  
  async create(data) {
    const order = new Order(data)
    await order.save()
  },
  convert(order) {
    const productsArr = []
    order.products.forEach((product) => {
      productsArr.push({
        name: product.name,
        sku: product.sku,
        ean: product.ean,
        storage_id: product.storage_id,
        storage_name: '',
        cancelled: false,
        delivery_price_returned: false,
        price: {
          buy: {
            netto: 0,
            brutto: 0
          },
          sell: {
            netto: nettoPrice(product.price_brutto,product.tax_rate),
            brutto: product.price_brutto
          }
        },
        tax_rate: product.tax_rate,
        quantity: product.quantity,
        profit: 0,
        location: product.location,
        auction_id: product.auction_id,
      })
    })
    return {
      order_id: order.order_id,
      date_confirmed: order.date_confirmed,
      date_in_status: order.date_in_status,
      admin_comments: order.admin_comments,
      delivery_method: order.delivery_method,
      delivery_price: order.delivery_price,
      products: productsArr
    }
  },
  async load (date) {
    return await baselinker.getOrders(date)
  },
  async exist(id) {
    const order = await Order.find({order_id: id})
    return order[0]
  },  
  async updateFromData (year, month, day, time = 86400) {
    const startDate = await baselinker.convertData(year, month, day),
          endDate = startDate + time,
          ordersBuffor = []
    let productsBuffor = []
    //First init
    let data = await this.load(startDate)
    let nextDate = startDate
    //Loop until load all data (Max 100 per run)
    do {
      for (let index in data) {
        if(data[index].date_confirmed < endDate) {
          const order = await this.exist((data[index]).order_id)
          if(order) {
            //changes in order
          } else {
            const convertedOrder = this.convert(data[index])
            for (const index in convertedOrder.products) {
              const product = convertedOrder.products[index]
              const storageName = convertedOrder.products[index].storage_name = await storages.getName(product.storage_id)
              if(productsBuffor[storageName]) {
                if(products.testEAN(product.ean,productsBuffor[storageName]) || products.testSKU(product.sku,productsBuffor[storageName])) { //Test ean or sku
                  productsBuffor[storageName].push(product)
                }  
              } else {
                productsBuffor[storageName] = []
                productsBuffor[storageName].push(product)
              }
              ordersBuffor.push(convertedOrder)
            }
          }
        }
      }
      nextDate = data[data.length - 1].date_confirmed + 1
      if (nextDate < endDate) {
        data = await this.load(nextDate)
      }
    } while (nextDate < endDate)
    for(const storage in productsBuffor) {
      productsBuffor[storage] = await prices.getPrices(productsBuffor[storage],storage) //Prices load from storages
      for(const product of productsBuffor[storage]) {
        products.update(product)
      }
    }
    ordersBuffor.forEach((order) => {
      this.create(order) // Create new order
    })
  },

  async getCancellations(token, year, month, day)
  {
      const date=convertToUnixTimestamp(year, month, day, 0, 0, 0)
      const info = new URLSearchParams({
          'method':'getOrders',
          'parameters':`{"date_from":+${date},"status_id":+${289429}}`
      }).toString().replaceAll('%2B','+')

      try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': token,
          },
          data:info,
          
      });
          let cancellationsId=[]
          for(let order of load.data.orders)
          {
              cancellationsId.push(order.order_id)
          }

          return cancellationsId
      } catch(err) {
          console.log(err);
      }
  },

  async matchCancellations(orders)
  {
    const cancellationsId=await this.getCancellations();

    for(let order of orders)
    {
      if(cancellationsId.includes(orders.order_id))
      {
        order.cancelled=true;

        if(order.admin_comments.includes('zwrot z dostawą'))
        {
          order.delivery_price_returned=true;
        }
      }
    }
  },

  async loadOrdersFromDatabase(month, day)
    {
      const currentYear=(new Date).getFullYear()
      const startDate = await baselinker.convertData(currentYear, month, day),
        endDate = startDate + 86400
      let orders=await Order.find(function (err, orders) {
          if (err) return 'error';
          else return orders
      }).clone().catch(function(err){return err})
      
      let ordersFilteredByDate=[]

      for(let order of orders)
      {
        if(order.date_confirmed>startDate && order.date_confirmed<endDate)
        {
          ordersFilteredByDate.push(order)
        }
      }
      return ordersFilteredByDate;
    },

    async getProfitFromOrders(month, day)
    {
        const orders=await this.loadOrdersFromDatabase(month, day);
        let profit=0;

        for(let order of orders)
        {
              for(let product of order.products)
              {
                  profit+=product.profit;
              }
              
              profit+=order.delivery_price;
        }

        return profit;
    },

    async getProfitFromOrdersWithCancellations(month, day)
    {
        const orders=await this.loadOrdersFromDatabase(month, day);
        this.matchCancellations(orders);
        let profit=0;

        for(let order of orders)
        {
            if(!order.cancelled)
            {
              for(let product of order.products)
              {
                  profit+=product.profit;
              }
              
              profit+=order.delivery_price
            }
            else
            {
              for(let product of order.products)
              {
                  profit-=product.price.buy.brutto;
              }

              if(order.delivery_price_returned)
              {
                profit-=order.delivery_price
              }
              else
              {
                profit+=order.delivery_price
              }
            }
        }

        return profit;
    },

    async getProfitFromOutlet(month, day)
    {
        const orders=await this.loadOrdersFromDatabase(month, day);
        let profit=0;

        for(let order of orders)
        {
            for(let product of order.products)
            {
                if(product.location='')
                {
                    profit+=product.profit;
                }
            }
        }

        return profit;
    },


    async getProfitFromOutletWithCancellations(month, day)
    {
        const orders=await this.loadOrdersFromDatabase(month, day);
        let profit=0;

        for(let order of orders)
        {
            for(let product of order.products)
            {
                if(product.location='')
                {
                    profit+=product.profit;
                }
            }
        }

        for(let order of orders)
        {
            if(!order.cancelled)
            {
              for(let product of order.products)
              {
                  if(product.location='')
                  {
                      profit+=product.profit;
                  }
              }
              
              profit+=order.delivery_price
            }
            else
            {
              if(order.delivery_price_returned)
              {
                profit-=order.delivery_price
              }
              else
              {
                profit+=order.delivery_price
              }
            }
        }
        return profit;
    },

    async getLossFromCancellations(month, day)
    {
      const orders=await this.loadOrdersFromDatabase(month, day);
      this.matchCancellations(orders);
      let loss=0;

      for(let order of orders)
      {
          if(order.cancelled)
          {
            for(let product of order.products)
            {
                loss+=product.price.buy.brutto;
            }

            if(order.delivery_price_returned)
            {
              loss+=order.delivery_price
            }
            else
            {
              loss-=order.delivery_price
            }
          }
      }

      return loss;
    },
}

module.exports = orders