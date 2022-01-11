const axios = require('axios')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

const baselinker = {
  async convertData(year, month, day, hours = 0, minutes = 0, seconds = 0){ 
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
  },
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
      return await load.data.orders;
    } catch(err) {
        console.log(err);
    }
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
        console.log(err);
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
    }
  },
  
}

module.exports = baselinker