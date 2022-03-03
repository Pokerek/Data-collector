const axios = require('axios')
require('dotenv').config()


const baselinker = {
  token: process.env.BL_TOKEN || '',
  stoper: {
    time: new Date().getTime() / 1000,
    request: 1
  },
  delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    })
 },
  async blocker() {
    if(this.stoper.request > 50) { // wait
      const date = new Date().getTime() / 1000
      const breakTime = 60 - (date - this.stoper.time)
      if(breakTime > 0) await this.delay(breakTime * 1000)
      this.stoper.time = new Date().getTime() / 1000
      this.stoper.request = 0
    } 
    this.stoper.request++
  },
  async getOrders(date,parameters = {
    date_confirmed_from: date
  }) {
    await this.blocker()
    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
        },
        data: new URLSearchParams({
          method: 'getOrders',
          parameters: JSON.stringify(parameters).replaceAll(':',':+')
        }).toString().replaceAll('%2B','+'),   
      })
      return load.data.orders     
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async getInventories() {
    await this.blocker()
    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
        },
        data: new URLSearchParams({
          method: 'getInventories',
          parameters: JSON.stringify({}).replaceAll(':',':+')
        }).toString().replaceAll('%2B','+'),   
      })
      return load.data.inventories     
    } catch(err) {
        console.log(err.response);
        return false
    }
  },
  
  convertData(year, month, day, hours = 0, minutes = 0, seconds = 0){ 
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
  },

  prepareParams(params) {
    let text = '{'
    for(const param in params){
      text += `"${param}":"${params[param]}",`
    }
    text += '}'
    return text
  },

  async setOrderStatus(orderID,statusID) {
    await this.blocker()
    try{
      await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
        },
        data: new URLSearchParams({
          method: 'setOrderStatus',
          parameters: JSON.stringify({order_id: orderID, status_id: statusID}).replaceAll(':',':+')
        }).toString().replaceAll('%2B','+'),   
      })    
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async setOrderProductFields(orderID,productID,location) {
    await this.blocker()
    try{
      await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
        },
        data: new URLSearchParams({
          method: 'setOrderProductFields',
          parameters: JSON.stringify({order_id: orderID, order_product_id: productID, location: location}).replaceAll(':',':+')
        }).toString().replaceAll('%2B','+'),   
      })   
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async getStorageList() {
    const info = new URLSearchParams({
      'method':'getExternalStoragesList',
      'parameters':'{}'
    }).toString().replaceAll('%2B','+');
    await this.blocker()
    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
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
    await this.blocker()
    try{
      const load = await axios({
        method: 'post',
        url:'https://api.baselinker.com/connector.php',
        headers:{
        'X-BLToken': this.token,
        },
        data:info,   
      });
      return await load.data.statuses  
    } catch(err) {
        console.log(err.response);
        return false
    }
  },

  async getProductId(warehouseId, ean)
  {
    const info = new URLSearchParams({
        'method':'getProductsList',
        'parameters':`{"storage_id":+"${warehouseId}","filter_ean":+"${ean}"}`
    }).toString().replaceAll('%2B','+')

    try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': this.token,
          },
          data:info,
          
      });
      
      return [load.data.products[0].product_id]
    } catch(err) {
        console.log('Looking for product ID failed.');
        return false
    }
  },

  async getProductData(warehouseId, productsIdArr)
  {
    const info = new URLSearchParams({
        'method':'getProductsData',
        'parameters':`{"storage_id":+"${warehouseId}","products":+${productsIdArr}}`
    }).toString().replaceAll('%2B','+')

    try{
      const load = await axios({
          method: 'post',
          url:'https://api.baselinker.com/connector.php',
          headers:{
          'X-BLToken': this.token,
          },
          data:info,
          
      });

      let products=[]
      for(let product of Object.keys(load.data.products)) {
        products.push(load.data.products[product])
      }

      return products[0]

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
        'X-BLToken': this.token,
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
        'X-BLToken': this.token,
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
          'X-BLToken': this.token,
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
          'X-BLToken': this.token,
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
              "351": 0
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
          'X-BLToken': this.token,
        },
        data:info,
        
    });

    if(load.data.status=='SUCCESS')
    {
      return `Product was added to catalogue Domyślny on id ${load.data.product_id}.`
    }
    else
    {
      return `Product add function failed because of ${load.data.error_code}.`
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
      let newquantity=checkDomyslny.stock.bl_555 + product.quantity
      this.changeProductQuantityForDomyslny(checkDomyslny.product_id, newquantity)
      return `Produktowi ${checkDomyslny.product_id} w katalogu DOMYŚLNY zmieniono stan na ${newquantity} pod wpływem anulacji.`
    }
    else if(checkFreestore!=false)
    {
      let newquantity=checkFreestore.stock.bl_555 + product.quantity
      this.changeProductQuantityForFreestore(checkFreestore.product_id, newquantity)
      return `Produktowi ${checkDomyslny.product_id} w katalogu FREESTORE zmieniono stan na ${newquantity} pod wpływem anulacji.`
    }
    else 
    {
      return this.addNewProduct(product)
    }
  }
}

module.exports = baselinker