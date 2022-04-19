const Agenda = require('agenda')
const orders = require('../database/orders')
const { convertData } = require('../../controllers/baselinker')
require('dotenv').config()

const url = process.env.DB_URL 
const agenda = new Agenda({ db: { address: url, collection: 'agendaJobs' } })

agenda.define('get orders', async () => {
    const today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    }
    const period = 30;
    for (let i = period - 1; i > 0; i--) {
        const date = new Date (convertData(today.year, today.month, today.day - i) * 1000)
        console.log(`Data: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        await orders.updateFromData(today.year, today.month, today.day - i,1)
        console.log(`-----------------------------------------`)
    }
})

const schedule = async () => {
    await agenda.start()
    await agenda.every('0 2 * * *', 'get orders')
}

module.exports = schedule