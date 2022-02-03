const mongoose = require('./database/mongoose')
const baselinker = require('./baselinker')
const orders = require('./orders')
const products = require('./products/products')
const storages = require('./storages')
const prices = require('./prices/prices')

const outletSchema = new mongoose.Schema({
			name: String,
			sku: String,
			ean: String,
      storage_id: String,
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
      auction_id: String,
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
      attributes:String,
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

    let productPriceBrutto=0
    if(product.price!=undefined)
    {
      productPriceBrutto=product.price.sell.brutto
    }
    else
    {
      productPriceBrutto=product.price_brutto
    }

    return {
        name: product.name,
        sku: sku,
        ean: product.ean,
        storage_id: product.storage_id,
        storage_full_id: product.storage + '_' + product.storage_id,
        price: {
          sell: {
            netto: prices.nettoPrice(productPriceBrutto, product.tax_rate),
            brutto: productPriceBrutto
          }
        },
        tax_rate: product.tax_rate,
        quantity: product.quantity,
        location: product.location,
        order_id: orderId,
        auction_id: orderId,
        found_data: {},
        added_into_system: false,
        attributes:product.attributes
      }
  },

  async loadOutlet(year, month, day)
  {

    const actualOutlet = await this.loadOutletFromDatabase()

    let Outlet_products=[]
    //await orders.matchCancellations(year, month, day)
    let todayOrders=await orders.loadOrdersFromDatabase(year, month, day);

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
        if(!this.checkIfIdenticalProductExistInDatabase(actualOutlet, this.convert(product)))
        {
          Outlet_products.push(this.convert(product))
        }
      }
      else
      {
        Outlet_products.push(this.convert(product))
      }
    }

    let iteration=1

    for(let product of Outlet_products)
    {
      product.found_data=await this.getOutletProductFoundData(product)

      if(product.found_data==false)
      {
        product.found_data=await this.tryExternalStorage(product)
      }
      
      await this.create(product)
      console.log("Dodano "+ iteration +" z "+Outlet_products.length+"produktów.")
      iteration++
    }

    console.log('Wszystkie produkty zostały dodane do bazy danych outletu.')
  },

  checkIfIdenticalProductExistInDatabase(database_products, productToCheck)
  {
    let ordersId=[]
    for(let product of database_products)
    {
      ordersId.push(product.order_id)
    }

    return ordersId.includes(productToCheck.order_id)
  },

  async getOutletProductFoundData(Outlet_product)
  {
    let product_id = await baselinker.getProductId(Outlet_product.storage_full_id, Outlet_product.ean, Outlet_product.sku)
    
    if(product_id!=false)
    {
      const product_data= await baselinker.getProductData(Outlet_product.storage_full_id, product_id);
      if(product_data!=false)
      {
        return product_data
      }
      else
      {
        return false
      }
      
    }
    else
    {
      let productIdInfo=await baselinker.getProductIdData(Outlet_product.storage_id, Outlet_product.ean, Outlet_product.sku)
      product_id=await baselinker.getProductId(productIdInfo[0], Outlet_product.ean, Outlet_product.sku)
      if(product_id!=false)
      {
        console.log([productIdInfo[0], product_id])
        const product_data= await baselinker.getProductData(productIdInfo[0], product_id);
        if(product_data!=false)
        {
          return product_data
        }
        else
        {
          return false
        }
        
      }
      else
      {  
        return false
      }
    }
    
  },

  async tryExternalStorage(Outlet_product)
  {
    if(Outlet_product.found_data==false)
    {
      let product_id = await baselinker.getExternalStorageProductId(Outlet_product.storage_full_id, Outlet_product.ean, Outlet_product.sku)
      
      if(product_id!=false)
      {
        const product_data= await baselinker.getExternalStorageProductData(Outlet_product.storage_full_id, product_id);
        if(product_data!=false)
        {
          return product_data
        }
        else
        {
          return false
        }
        
      }
    }
    
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
        orders.matchCancellations(year, month, day);
        let todayOrders=await orders.loadOrdersFromDatabase(year, month, day);
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
      await Outlet.findOneAndDelete({
        _id: database_id
      });
    },

    async actualizeQuantityInDatabaseProduct(database_id, newquantity)
    {
      await Outlet.findOneAndUpdate({ _id:database_id}, { quantity: newquantity });
    },  

    async matchAddedIntoSystem(database_id)
    {
      await Outlet.findOneAndUpdate({ _id:database_id}, { added_into_system: true });
    },

    async addOutletToSystem()
    {
      const actualOutlet=await this.loadOutletFromDatabase()
      let added=[]
      let errors=[]
      let iteration=1

      for(let outletproduct of actualOutlet)
      {
        console.log('Dodawanie '+iteration+' z '+ actualOutlet.length + ' produktów do Outletu')
        if(outletproduct.added_into_system!=true)
        {
          if(outletproduct.found_data!=false && outletproduct.found_data!=undefined)
          {
            let baselinkerOutput=await baselinker.addProductToSystem(outletproduct)
            if(typeof baselinkerOutput == 'number')
            {
              added.push([outletproduct.name, outletproduct.ean, baselinkerOutput])
            }
            else
            {
              errors.push([outletproduct.name, outletproduct.ean, outletproduct._id])
            }
            await this.matchAddedIntoSystem((outletproduct._id).toString().replaceAll('new ',''))
          }
          else
          {
            errors.push([outletproduct.name, outletproduct.ean, outletproduct._id])
            await this.matchAddedIntoSystem((outletproduct._id).toString().replaceAll('new ',''))
          }
          
        }
        iteration++;
      }
      console.log('Dodano z sukcesem '+ added.length +' z '+ actualOutlet.length +' produktów, co daje '+ ((added.length*100/actualOutlet.length).toFixed(2)) +'% skuteczności, są to produkty:')
      console.log(added)
      console.log('nie udało się dodać '+ errors.length +' z '+ actualOutlet.length +' produktów, poniższe produkty dodaj ręcznie:\n')
      console.log(errors)
    },  

    async removeSold()
    {
      let today=new Date()
      let day=today.getDate()
      let month=today.getMonth()+1
      let year=today.getFullYear()

      const newOrders = await orders.loadOrdersFromDatabase(year, month, day)
      const actualOutlet = await this.loadOutletFromDatabase()

      for(let order of newOrders)
      {
        for(let product of order.products)
        {
          for(let outletproduct of actualOutlet)
          {
            if(outletproduct.auction_id == product.auction_id)
            {
              if(outletproduct.quantity > product.quantity)
              {
                let newquantity = outletproduct.quantity - product.quantity
                await actualizeQuantityInDatabaseProduct(outletproduct._id, newquantity)

                return `Zaktualizowano stan produktu ${outletproduct._id} na ${newquantity}, przez zamówienie ${product.order_id}`
              }else
              {
                await removeProductFromDatabase(outletproduct_id)
                return `Usunięto z bazy danych outletu produkt ${outletproduct.ean}, przez zamówienie ${product.order_id}`
              }
            }
          }
        }
      }
    },

    async updateOutlet(year, month, day)
    {
      await this.loadOutlet(year, month, day)
      console.log('Nowy outlet załadowany do bazy danych')
      await this.removeSold()
      console.log('Zmiany w istniejącym w bazie danych outlecie dokonane')
      await this.addOutletToSystem()
      console.log('Zmiany w bazie danych dokonane')
    }

}

module.exports = outlet