//const mongoose = require('./connect')
const axios = require('axios')
const mongoose = require('./connect')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''


function convertToUnixTimestamp(year, month, day, hours = 0, minutes = 0, seconds = 0)
{
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
}



(async() => {
    
    let from=convertToUnixTimestamp(2022, 1, 2, 0, 0, 0)
    console.log(new URLSearchParams({
        'method':'getOrders',
        'parameters':`{"date_from":+${from},"status_id":+${289429}}`
    }).toString().replaceAll('%2B','+'))
    console.log(await getCancellations(token, 2021, 12, 12))
})();