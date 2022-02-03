const axios = require('axios')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

const baselinker = {
  async getOrders(data) {
    const info = new URLSearchParams({
      'method':'getOrders',
      'parameters':`{"date_from":+${data}}`
    }).toString().replaceAll('%2B','+');

    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': token,
        },
        data:info,   
      });
      
      let orders=[]

      for(let order of load.data.orders)
      {
        if(order.status_id!=297842)
        {
          orders.push(order)
        }
      }

      return orders
      
    } catch(err) {
        console.log(err.response);
        return false
    }
  },
  
  convertData(year, month, day, hours = 0, minutes = 0, seconds = 0){ 
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
  },

  async getStorageList() {
    const info = new URLSearchParams({
      'method':'getExternalStoragesList',
      'parameters':'{}'
    }).toString().replaceAll('%2B','+');

    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': token,
        },
        data:info,   
      });
      return await load.data.storages
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async getOrderStatusList () {
    const info = new URLSearchParams({
      'method':'getOrderStatusList',
      'parameters':'{}'
    }).toString().replaceAll('%2B','+');

    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': token,
        },
        data:info,   
      });
      return await load.data.statuses
    } catch(err) {
        console.log(err);
        return false
    }
  },

  async getProductId(storageId, ean, sku)
  {
    let info='';
    if(ean!='')
    {
      info = new URLSearchParams({
        'method':'getProductsList',
        'parameters':`{"storage_id":+"${storageId}","filter_ean":+"${ean}"}`
      }).toString().replaceAll('%2B','+')
    }
    else
    {
      info = new URLSearchParams({
        'method':'getProductsList',
        'parameters':`{"storage_id":+"${storageId}","filter_sku":+"${ean}"}`
      }).toString().replaceAll('%2B','+')
    }

    try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': token,
          },
          data:info,
          
      });
      console.log('Product ID by storage found.');
      return [load.data.products[0].product_id]
    } catch(err) {
      console.log('Looking for product ID by storage failed.');
      return false
    }
  },

  async getProductIdData(inventoryId, ean, sku)
  {
    let info='';
    if(ean!='')
    {
      info = new URLSearchParams({
        'method':'getInventoryProductsList',
        'parameters':`{"inventory_id":+"${inventoryId}","filter_ean":+"${ean}"}`
      }).toString().replaceAll('%2B','+')
    }
    else if(sku!='')
    {
      info = new URLSearchParams({
        'method':'getInventoryProductsList',
        'parameters':`{"inventory_id":+"${inventoryId}","filter_sku":+"${sku}"}`
      }).toString().replaceAll('%2B','+')
    }
    else
    {
      return false
    }

    try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': token,
          },
          data:info,
          
      });
      console.log('Product ID by inventory found.');
      return load.data//[Object.keys(load.data.products[Object.keys(load.data.products)[0]].stock)[0],load.data.products[Object.keys(load.data.products)[0]].id]
    } catch(err) {
        console.log('Looking for product ID by inventory failed.');
        return err
    }
  },

  async getExternalStorageProductId(inventoryId, ean, sku)
  {
    let info='';
    if(ean!='')
    {
      info = new URLSearchParams({
        'method':'getExternalStorageProductsList',
        'parameters':`{"storage_id":+"${inventoryId}","filter_ean":+"${ean}"}`
      }).toString().replaceAll('%2B','+')
    }
    else if(sku!='')
    {
      info = new URLSearchParams({
        'method':'getExternalStorageProductsList',
        'parameters':`{"storage_id":+"${inventoryId}","filter_sku":+"${sku}"}`
      }).toString().replaceAll('%2B','+')
    }
    else
    {
      return false
    }

    try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': token,
          },
          data:info,
          
      });
      console.log('Product ID by external storage found.');
      return [load.data.products[0].product_id]
    } catch(err) {
        console.log('Looking for product ID by external storage failed.');
        return err
    }
  },

  async getExternalStorageProductData(storageId, productsIdArr)
  {
    const info = new URLSearchParams({
        'method':'getExternalStorageProductsData',
        'parameters':JSON.stringify({
          "storage_id": storageId,
          "products": productsIdArr}).replaceAll(':',':+')
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

      let products=[]
      for(let product of Object.keys(load.data.products)) {
        products.push(load.data.products[product])
      }

      console.log('Product data by external storage found.');

      return products[0]

    } catch(err) {
      console.log('Looking for product data by external storage failed.');
      return false
    }
  },

  async getProductData(storageId, productsIdArr)
  {
    const info = new URLSearchParams({
        'method':'getProductsData',
        'parameters':`{"storage_id":+"${storageId}","products":+${productsIdArr}}`
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
      let products=[]
      for(let product of Object.keys(load.data.products)) {
        products.push(load.data.products[product])
      }

      console.log('Product data by storage found.');

      return products[0]

    } catch(err) {
      console.log('Looking for product data by storage failed.');
      return false
    }
  },

  
  async getCancellations(data)
  {

    const info = new URLSearchParams({
        'method':'getOrders',
        'parameters':`{"status_id":+${289429},"date_from":+${data}}`
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
      for(let order of load.data.orders) {
        cancellationsId.push(order.order_id)
      }

      return cancellationsId
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async getNotFullCancellations()
  {
    const info = new URLSearchParams({
      'method':'getOrders',
      'parameters':`{"status_id":+${297842},"get_unconfirmed_orders":+true}`
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
    
    return load.data.orders[load.data.orders.length-1]
    } catch(err) {
        console.log('Błąd w pobieraniu niepełnych zamówień');
        return false
    }
  },

  async getNotFullCancellationsLoss(year, month, day)
  {
    const info = new URLSearchParams({
      'method':'getOrders',
      'parameters':`{"status_id":+${297842},"get_unconfirmed_orders":+true}`
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
    
    let loss=0
    for(let product of load.data.orders[load.data.orders.length-1].products)
    {
      if(product.attributes==`${day}.${month}.${year}`.replaceAll(' ',''))
      {
        loss+=product.price_brutto
      }
    }
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async checkIfProductIsInDomyslny(ean, sku)
  {
    const info = new URLSearchParams({
      'method':'getInventoryProductsList',
      'parameters':`{"inventory_id":+"380","filter_ean":+"${ean}"}`
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
    
      if(Object.keys(load.data.products)!='')
      {
        if(load.data.products[Object.keys(load.data.products)[0]].sku.includes(sku))
        {
          return load.data.products[Object.keys(load.data.products)[0]]
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

    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async checkIfProductIsInFreestore(ean, sku)
  {
    const info = new URLSearchParams({
      'method':'getInventoryProductsList',
      'parameters':`{"inventory_id":+"1154","filter_ean":+"${ean}"}`
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

    if(Object.keys(load.data.products)!='')
    {
      if(load.data.products[Object.keys(load.data.products)[0]].sku.includes(sku))
      {
        return load.data.products[Object.keys(load.data.products)[0]]
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
    
    
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async changeProductQuantityForDomyslny(inventory_product_id, newquantity)
  {
    const info = new URLSearchParams({
      'method':'updateInventoryProductsStock',
      'parameters':JSON.stringify({
        "inventory_id":"380",
        "products":{
          [inventory_product_id]:{
            "bl_555":newquantity
          }}}).replaceAll(':',':+')
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

    
    if(load.data.status=='SUCCESS')
    {
      return `Product ${inventory_product_id} quantity was updated in Domyslny to ${newquantity}.`
    }
    else
    {
      return `Product ${inventory_product_id} quantity update got failed because of ${load.data.error_code}.`
    }

    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async changeProductQuantityForFreestore(inventory_product_id, newquantity)
  {
    const info = new URLSearchParams({
      'method':'updateInventoryProductsStock',
      'parameters':JSON.stringify({
        "inventory_id":"1154",
        "products":{
          [inventory_product_id]:{
            "bl_555":newquantity
          }}}).replaceAll(':',':+')
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

    if(load.data.status=='SUCCESS')
    {
      return `Product ${inventory_product_id} quantity was updated in Freestore to ${newquantity}.`
    }
    else
    {
      return `Product ${inventory_product_id} quantity update got failed because of ${load.data.error_code}.`
    }
    
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async addNewProduct(outletproduct)
  {
    let categoryId=''
    if(outletproduct.sku=='ZWROT')
    {
      categoryId='1467847'
    }
    else if(outletproduct.sku=='OUTLET')
    {
      categoryId='1470267'
    }
    else
    {
      
    }

    let imagesPreparation=[];

    for(let image of outletproduct.found_data.images)
    {
      image="url:"+image
      imagesPreparation.push(image.replaceAll(":",";"))
    }
    
    

    let featuresPreparation = {}
    for(let array of outletproduct.found_data.features)
    {
      featuresPreparation[array[0]]=array[1]
    }

    let price=0

    switch(outletproduct.price.sell.brutto)
    {
      case outletproduct.price.sell.brutto<=50:
        price=outletproduct.price.sell.brutto*0,7;
        break;
      case outletproduct.price.sell.brutto<=100:
        price=outletproduct.price.sell.brutto*0,8;
        break;
      case outletproduct.price.sell.brutto>100:
        price=outletproduct.price.sell.brutto*0,9;
        break;
      default:
        price=outletproduct.price.sell.brutto;
        break;
    }
    
    
    
    const info = new URLSearchParams({
      "method":"addInventoryProduct",
      "parameters":JSON.stringify({
        "inventory_id": "380",
        "is_bundle": false,
        "ean": outletproduct.ean,
          "sku": outletproduct.sku,
          "tax_rate": 23,
          "weight": outletproduct.weight,
          "category_id": categoryId,
          "prices": {
              "351": price
          },
          "stock": {
              "bl_555": outletproduct.quantity,
          },
          "text_fields": {
            "name": outletproduct.found_data.name,
            "description": outletproduct.found_data.description,
            "description_extra1": outletproduct.found_data.description_extra1,
            "description_extra2": outletproduct.found_data.description_extra2,
            "description_extra3": outletproduct.found_data.description_extra3,
            "description_extra4": outletproduct.found_data.description_extra4,
            "features": featuresPreparation
          },
          "images": imagesPreparation,
        }).replaceAll(':',':+').replaceAll(';',':')
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

    if(load.data.status=='SUCCESS')
    {
      return load.data.product_id
    }
    else
    {
      return load.data.error_code
    }
    
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async addProductToSystem(product)
  {
    const checkFreestore =await this.checkIfProductIsInFreestore(product.ean, product.sku)
    const checkDomyslny =await this.checkIfProductIsInDomyslny(product.ean, product.sku)

    if(checkDomyslny!=false && checkDomyslny.product_id!=undefined)
    {
      let newquantity=checkDomyslny.stock['bl_555']  + product.quantity
      this.changeProductQuantityForDomyslny(checkDomyslny.product_id, newquantity)
      return `Produktowi ${checkDomyslny.product_id} w katalogu DOMYŚLNY zmieniono stan na ${newquantity} pod wpływem anulacji.`
    }
    else if(checkFreestore!=false && checkFreestore.product_id!=undefined)
    {
      let newquantity=checkFreestore.stock['bl_555'] + product.quantity
      this.changeProductQuantityForFreestore(checkFreestore.product_id, newquantity)
      return `Produktowi ${checkFreestore.product_id} w katalogu FREESTORE zmieniono stan na ${newquantity} pod wpływem anulacji.`
    }
    else 
    {
      return this.addNewProduct(product)
    }
  }
}

module.exports = baselinker