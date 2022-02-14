const Agenda = require('agenda');
//const getUserToken = require('./allegro/user_token');
const { database } = require('agenda/dist/agenda/database');
const storages = require('./storages');
const orders = require('./orders');

const mongoConnectionString = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';

const oneDay = 86400000

const agenda = new Agenda({ db: { address: mongoConnectionString } });

/*function isTokenValid(token)
{
    let now = (new Date).getTime()/1000
    if(token != 'error') return token.date_of_expiration>now
    else return false
}

agenda.define('get new allegro user token', async (job) => {
    getUserToken()
});*/

agenda.define('get yesterday orders', async (job) => {
    const yesterday = new Date(new Date() - oneDay)
    const day = yesterday.getDate()
    const month = yesterday.getMonth() + 1
    const year = yesterday.getFullYear()
    if(yesterday.getDay() > 0 && yesterday.getDay() < 6) {
        await orders.updateFromData(year, month, day);
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

agenda.define('update storages', async (job) => {
    storages.update()
});



agenda.define('update database', async (job) => {
    //function to count today initial profit and save it as raport in db
    //function to cancell profit from cancellations and change raports of latest days
    //function to get outlet products
})

const scheduler = async () => {
    await agenda.start();
    await agenda.every('1 week','update storages')
    await agenda.every('1 day', ['get yesterday orders'])
}

module.exports = scheduler