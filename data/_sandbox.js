const baselinker = require('./baselinker');
const outlet = require('./outlet');
const statuses = require('./statuses')
/*const products = require('./products');

const storages = require('./storages')
const examples = require('./examples')
const prices = require('./prices/prices')
const wholesalers = require('./prices/wholesalers')*/

//orders.updateFromData(2022 , 1, 6)

async function outletEnter()
{
    // let dboutlet = await outlet.loadOutletFromDatabase()
    // console.log(dboutlet)

    await outlet.loadOutlet(2022, 5, 2)
    await outlet.wait()

    await outlet.addOutletToSystem()
}
outletEnter()


// async function statusUpdate()
// {
//     await statuses()
// }
// statusUpdate()