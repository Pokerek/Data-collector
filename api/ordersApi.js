const axios = require('axios');
const ps  = require('prompt-sync');
const prompt = ps();
const token = '';

async function convertToUnixTimestamp(year, month, day, hours, minutes, seconds)
{
    return new Date(year, month-1, day, hours, minutes, seconds).getTime()/1000
}

function getOrdersPrepareData(from)
{
    return new URLSearchParams({
        'method':'getOrders',
        'parameters':`{"date_from":+${from}}`
    }).toString().replaceAll('%2B','+')
}

async function getOrders(token, from)
{
    let info=getOrdersPrepareData(from)
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
    }catch(err)
    {
        console.log(err);
    }
}

(async() => {
    let date = await convertToUnixTimestamp(2021,12,28,0,0,0)
    console.log(date)

    console.log(await getOrders(token, date))
    
})();