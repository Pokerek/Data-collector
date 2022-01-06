const wholesalers = require('./wholesalers')
const puppeteer = require('puppeteer')

const prices = {
    async getPrices (products, storageName) {
        const storage = wholesalers[storageName]
        const browser = await puppeteer.launch({
            headless: false
        })

        const page = await browser.newPage()

        await page.setViewport({ width: 1600, height: 600})
        await page.goto(storage.urls.login, {waitUntil: 'networkidle2'});

        //Login
        if(storage.selectors.preLogin) { //Pre login button
            await page.click(storage.selectors.preLogin)
            await page.waitForSelector(storage.selectors.login,{timeout:500})
        }
        if(storage.selectors.employee) { //Special field in login form
            await page.type(storage.selectors.employee, storage.access.employee);
        }
        await page.type(storage.selectors.login, storage.access.login);
        await page.type(storage.selectors.password, storage.access.password)
        await Promise.all([ //Login submit
            page.click(storage.selectors.submit),
            page.waitForNavigation({waitUntil: 'networkidle2'})
        ])

        //Cookies and alerts
        for(const option in storage.alerts) {
            const element = storage.alerts[option]
            if(element) {
                await page.waitForSelector(element,{timeout:500})
                const loaded = await page.evaluate((selector) => {
                    return document.querySelector(selector) ? true : false}, 
                    element)
                if(loaded) { //Banner loaded
                    await page.click(element)
                    await page.waitForSelector(element,{timeout:500})
                }
            }
        }

        //Search
        for(let i = 0; i < products.length; i++) // For each product
        {
            const localProduct = products[i]; // Copy product
            for(let type of storage.typeSearch) { // Search for type
                await page.type(storage.selectors.search,localProduct[type])
                await page.waitForTimeout(200) // Wait after write
                await Promise.all([ //Click and load
                    page.click(storage.selectors.searchBtn),
                    page.waitForNavigation({waitUntil: 'networkidle2'})
                ])
                await Promise.race([ // Found or not
                    page.waitForSelector(storage.selectors.name),
                    page.waitForSelector(storage.selectors.notFound)
                ])
                const htmlText = await page.evaluate((selector) => {
                                    return document.querySelector(selector) ? document.querySelector(selector).textContent : false}, 
                                    storage.selectors.price)
                if(htmlText) {
                    localProduct.price.buy = await storage.getStoragePrice(localProduct.price.buy,htmlText,localProduct.tax_rate) // Price from storage
                    break
                }
            }
            products[i] = await this.update(localProduct) // Profit update
        }

        //Logout
        if(storage.urls.logout) { //URL
            await page.goto(storage.urls.logout, {waitUntil: 'networkidle2'});
        } else { //Button
            await page.click(storage.selectors.logout);
        }
        
        await browser.close();
        return products;
    },
    getProfit(productPrice) {
        return productPrice.buy.brutto ? this.calculate(productPrice) : 0
    },
    calculate(productPrice) {
        return (productPrice.sell.brutto - productPrice.buy.brutto).toFixed(2) * 1 //To edit
    },
    async update(product) {
        product.profit = this.getProfit(product.price)
        return product
    },
    nettoPrice(brutto,tax, place = 2) {
        return (brutto / (1 + tax / 100)).toFixed(place) * 1
    },
    bruttoPrice(netto,tax, place = 2) {
        return (netto * ( 1 + tax / 100)).toFixed(place) * 1
    }
}

module.exports = prices