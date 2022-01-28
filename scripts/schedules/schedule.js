const Agenda = require('agenda');
const getUserToken = require('../allegro/user_token');
const daily_raport = require('./prices/daily_raport');
const orders = require('./orders')
const complete_daily_raport = require('../prices/complete_daily_raport')
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

agenda.define('create daily raport', async (job) => {
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
        await daily_raport.createDailyRaport(year, date, month)
    }
});


agenda.define('create complete daily raport', async (job) => {
    let today=new Date()
    let date=today.getDate()
    let month=today.getMonth()
    let year=today.getFullYear()
    if(getDay()==2 || getDay()==3)
    {
        //day off
    }
    else if(today.getDay()==1)
    {
        new Date().setDate(new Date().getDate() - 3)
        await complete_daily_raport.createDailyRaport(year, month, date)
        
    }
    job.repeatEvery('24 hours', {
        skipImmediate: true
      });
        job.save()
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

agenda.define('get todays orders', async(job) => {
    let today=new Date()
    let date=today.getDate()
    let month=today.getMonth()+1
    let year=today.getFullYear()
    await orders.updateFromData(year, month, date-1)

    console.log('Orders loading job finished.');
});

async function Scheduler() 
{
    await agenda.start();

    await agenda.every('1 day', 'get todays orders')
    //await agenda.schedule('everyday', 'create daily raport')
    /*await agenda.every("1 day",[
    "get today orders",
    "get latest cancellations",
    "update database"
    ]);*/
}

Scheduler()