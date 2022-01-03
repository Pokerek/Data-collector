//const mongoose = require('./connect')
const axios = require('axios')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

function convertToUnixTimestamp(year, month, day, hours = 0, minutes = 0, seconds = 0)
{
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
}

async function getCancellations(token, year, month, day)
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
        return await load.data;
    } catch(err) {
        console.log(err);
    }
}

(async() => {
    
    let from=convertToUnixTimestamp(2022, 1, 2, 0, 0, 0)
    console.log(new URLSearchParams({
        'method':'getOrders',
        'parameters':`{"date_from":+${from},"status_id":+${289429}}`
    }).toString().replaceAll('%2B','+'))
    console.log(await getCancellations(token, 2021, 12, 12))
})();