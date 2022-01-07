/*const baselinker = require('./baselinker');*/
const orders = require('./orders');
/*const products = require('./products');
const statuses = require('./statuses')
const storages = require('./storages')
const examples = require('./examples')
const prices = require('./prices/prices')
const wholesalers = require('./prices/wholesalers')*/
const daily_raport=require('./prices/daily_raport')

//orders.updateFromData(2022 , 1, 6)

daily_raport.createDailyRaport(2022 , 1, 6)