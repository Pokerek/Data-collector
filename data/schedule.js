const Agenda = require('agenda');
const getUserToken = require('./allegro/user_token');
const getOrders = require('./orders');
const getPrices = require('./buy_price');
const { database } = require('agenda/dist/agenda/database');

const mongoConnectionString = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';

const agenda = new Agenda({ db: { address: mongoConnectionString } });

function isTokenValid(token)
{
    let now = (new Date).getTime()/1000
    if(token != 'error') return token.date_of_expiration>now
    else return false
}

agenda.define('get new allegro user token', async (job) => {
    getUserToken()
});

agenda.define('get todays orders', async (job) => {
    let today=new Date()
    let date=today.getDate()
    let month=today.getMonth()+1
    let year=today.getFullYear()
    if(today.getDay()==0 || today.getDay()==6)
    {
        //day off
    }
    else
    {
        await getOrders(year, month, date);
    }
});

agenda.define('get latest cancellations', async (job) => {
    if(getDay()==0 || getDay()==6)
    {
        //day off
    }
    else
    {
        //todo
    }
});


agenda.define('update database', async (job) => {
    //function to count today initial profit and save it as raport in db
    //function to cancell profit from cancellations and change raports of latest days
    //function to get outlet products
});

agenda.define('say hello', (job) => {
    console.log("Hello!");
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getYear();
    let cHours = currentDate.getHours();
    let cMinutes = currentDate.getMinutes();
    let cSeconds = currentDate.getSeconds();
    console.log(cDay + "/" + cMonth + "/" + cYear + "\t" + cHours + ":" + cMinutes + ":" + cSeconds);
});

async function Scheduler() 
{
    await agenda.start();
    //await agenda.every('11 hours', 'get new allegro user token')

    //await agenda.every('1 day', 'get todays orders')
    /*await agenda.every("1 day",[
    "get today orders",
    "get latest cancellations",
    "update database"
    ]);*/
}

Scheduler()