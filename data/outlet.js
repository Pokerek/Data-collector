const mongoose = require('./connect')
const baselinker = require('./baselinker')
const orders = require('./orders')
const products = require('./products')
const storages = require('./storages')
const prices = require('./prices/prices')

const outletSchema = new mongoose.Schema({
			name: String,
			sku: String,
			ean: String,
      storage_id: Number,
      storage_full_id: String,
      price: {
        sell: {
          netto: Number,
          brutto: Number
        }
      },
			tax_rate: Number,
			quantity: Number,
      order_id: String,
      found_data: {
        ean: String,
        sku: String,
        name: String,
        quantity: Number,
        price_netto: Number,
        price_brutto: Number,
        weight: Number,
        description: String,
        description_extra1: String,
        description_extra2: String,
        description_extra3: String,
        description_extra4: String,
        category_id: String,
        images: Array,
        features: Array,
        variants: Array
      },
      added_into_system:Boolean
})

const Outlet = mongoose.model('Outlet_product', outletSchema)


const outlet={
  async create(data) {
    await (new Outlet(data)).save()
  },

  convert(product) {
    let sku = '';
    switch(product.source_id)
    {
      case "31486":
      case "32537":
      case "37891": sku="OUTLET"
                    break;
      case "39975": sku="ZWROT"
                    break;
      default:  sku=product.sku
                break;
    }

    let orderId=''

    if(product.order_id!=undefined)
    {
      orderId=product.order_id
    }
    else
    {
      orderId=product.auction_id
    }

    return {
        name: product.name,
        sku: sku,
        ean: product.ean,
        storage_id: product.storage_id,
        storage_full_id: product.storage + '_' + product.storage_id,
        price: {
          sell: {
            netto: prices.nettoPrice(product.price_brutto,product.tax_rate),
            brutto: product.price_brutto
          }
        },
        tax_rate: product.tax_rate,
        quantity: product.quantity,
        location: product.location,
        order_id: orderId,
        found_data: {},
        added_into_system: false
      }
  },

  async loadOutlet(year, month, day)
  {

    const actualOutlet = await this.loadOutletFromDatabase()

    let Outlet_products=[]

    let todayOrders=await orders.loadOrdersFromDatabase(year, month, day);
    await orders.matchCancellations(todayOrders);
    const notFilteredFullCancellations=todayOrders

    const notFullCancellations=await baselinker.getNotFullCancellations()
    
    for(let order of notFilteredFullCancellations)
    {
      if(order.cancelled)
      {
        for(let product of order.products)
        {
          if(actualOutlet!='')
          {
            if(!this.checkIfIdenticalProductExistInDatabase(actualOutlet, product))
            {
              Outlet_products.push(this.convert(product))
            }
          }
          else
          {
            Outlet_products.push(this.convert(product))
          }
          
        }
      }
    }

    for(let product of notFullCancellations.products)
    {
      if(actualOutlet!='')
      {
        if(!this.checkIfIdenticalProductExistInDatabase(actualOutlet, product))
        {
          Outlet_products.push(this.convert(product))
        }
      }
      else
      {
        Outlet_products.push(this.convert(product))
      }
    }

    for(let product of Outlet_products)
    {
      product.found_data=await this.getOutletProductFoundData(product)
      await this.create(product)
    }
  },

  checkIfIdenticalProductExistInDatabase(database_products, productToCheck)
  {
    let auctionsId=[]
    for(let product of database_products)
    {
      auctionsId.push(product.auction_id)
    }

    return auctionsId.includes(productToCheck.auction_id)
  },

  async getOutletProductFoundData(Outlet_product)
  {
    const product_id = await baselinker.getProductId(Outlet_product.storage_full_id, Outlet_product.ean)
    const product_data= await baselinker.getProductData(Outlet_product.storage_full_id, product_id)
    return product_data
  },

  async loadOutletFromDatabase()
  {
    let Outlet_products=await Outlet.find(function (err, outlet_products) {
        if (err) return false;
        else return outlet_products
    }).clone().catch(function(err){return err})

    return Outlet_products
  },

  async getProfitFromOutlet(year, month, day)
    {
        const todayOrders=await orders.loadOrdersFromDatabase(year, month, day);
        let profit=0;

        for(let order of todayOrders)
        {
            for(let product of order.products)
            {
                if(product.sku.includes('OUTLET') || product.sku.includes('ZWROT'))
                {
                    profit+=product.profit;
                }
            }
        }

        return profit;
    },


    async getProfitFromOutletWithCancellations(year, month, day)
    {
        let todayOrders=await orders.loadOrdersFromDatabase(year, month, day);
        orders.matchCancellations(todayOrders);
        let profit=0;

        for(let order of todayOrders)
        {
            for(let product of order.products)
            {
                if(product.location='')
                {
                    profit+=product.price.sell.netto;
                }
            }
        }

        for(let order of todayOrders)
        {
            if(!order.cancelled)
            {
              for(let product of order.products)
              {
                  if(product.location='')
                  {
                      profit+=product.price.sell.netto;
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

    async removeProductFromDatabase(database_id)
    {
      Outlet.find({
        _id: database_id
      }).remove().exec()
    },

    async actualizeQuantityInDatabaseProduct(database_id, newquantity)
    {
      await Person.replaceOne({ database_id }, { quantity: newquantity });
    },  

    async addOutletToSystem()
    {
      const actualOutlet=this.loadOutletFromDatabase()
      
    },  

    async removeSold()
    {
      let today=new Date()
      let day=today.getDate()
      let month=today.getMonth()+1
      let year=today.getFullYear()

      const newOrders = await orders.loadOrdersFromDatabase()
      const actualOutlet = await this.loadOutletFromDatabase()

      for(let order of newOrders)
      {
        for(let product of order.products)
        {
          for(let outletproduct of actualOutlet)
          {
            if(outletproduct.quantity > product.quantity)
            {
              let newquantity = outletproduct.quantity - product.quantity
              actualizeQuantityInDatabaseProduct(outletproduct_id, newquantity)
            }else
            {
              removeProductFromDatabase(outletproduct_id)
            }
          }
        }
      }
    },

    async updateOutlet(year, month, day)
    {
      await this.loadOutlet(year, month, day)
      await this.removeSold()
    }

}

module.exports = outlet