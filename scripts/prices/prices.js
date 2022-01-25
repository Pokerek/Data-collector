const wholesalers = require('./wholesalers')
const puppeteer = require('puppeteer')
const profit = require('./profit')
const missedList = require('../products/missedList')

const prices = {
    async login(storage,page) {
        await page.goto(storage.urls.login, {waitUntil: 'networkidle2'});
        //Before alert
        await this.alert(storage.alerts.before,page)
        //Login
        if(storage.selectors.preLogin) { //Pre login button
            await page.click(storage.selectors.preLogin)
            await page.waitForTimeout(1000)
        }
        if(storage.selectors.employee) { //Special field in login form
            await page.type(storage.selectors.employee, storage.access.employee);
        }
        await page.type(storage.selectors.login, storage.access.login);
        await page.type(storage.selectors.password, storage.access.password)
        await Promise.all([ //Login submit
            page.click(storage.selectors.submit),
            await Promise.race([
                page.waitForNavigation({waitUntil: 'networkidle2'}),
                page.waitForTimeout(10000)
            ])
        ])

        //After alert
        await this.alert(storage.alerts.after,page)

        if(storage.options.special === 'APTEL') {
            await page.evaluate(() => {
                javascript:__doPostBack('ctl00','cookie_info_hide')
            })
            await page.waitForNavigation()
        } 
    },
    async search(storage,page,products) {
        // Wait for search reload
        if(storage.options.searchWait) {
            await page.waitForTimeout(500)
        }

        //Search
        for(let i = 0; i < products.length; i++) // For each product
        {
            const localProduct = products[i]; // Copy product
            let notFound = true
            for(let type of storage.typeSearch) { // Search for type
                await page.evaluate((selector) => { // Clear search field
                    document.querySelector(selector).value = ''
                },storage.selectors.search)
                await page.type(storage.selectors.search,localProduct[type])
                await page.waitForTimeout(300) // Wait after write
                if(storage.options.special === 'APTEL') {
                    await page.goto(`http://aptel.pl/ProduktyWyszukiwanie.aspx?search=${localProduct[type]}`)
                } else await page.keyboard.press('Enter')
                // Wait for search reload
                if(storage.options.searchWait) {
                    await page.waitForTimeout(storage.options.searchWait)
                } else {
                    await Promise.race([ //Timeout or page load
                        page.waitForNavigation({waitUntil: 'networkidle2'}),
                        page.waitForTimeout(5000)
                    ])
                }
                if(storage.options.table) {
                    const found = await page.evaluate((selector) => {
                        return document.querySelector(selector).childElementCount}, 
                        storage.selectors.table)
                    if (!found) continue // If not found search for next type
                } else {
                    await Promise.race([ // Found or not
                        page.waitForSelector(storage.selectors.name),
                        page.waitForSelector(storage.selectors.notFound)
                    ])
                }
                if(storage.options.special === "ORNO") {
                    await page.click('.box-body > table > tbody > tr > td.align-middle.text-center > a > i')
                    await page.waitForSelector(storage.selectors.price)
                }
                const htmlText = await page.evaluate((priceSelector,nameSelector,nameProduct) => {
                    const priceBox = document.querySelectorAll(priceSelector)
                    const length = priceBox.length
                    if(length) {
                        return priceBox[length - 1].innerText
                    } else {
                        return false
                    }
                }, storage.selectors.price,storage.selectors.name,localProduct.name)
                if(htmlText) {
                    localProduct.price.buy = this.getStoragePrice(localProduct.price.buy,htmlText,localProduct.tax_rate,storage.priceOptions) // Price from storage
                    notFound = false
                    break
                }
                
            }
            if(notFound) {
                missedList.add(localProduct)
            } else {
                products[i] = this.updateProfit(localProduct) // Profit update
            }
        }    
    },
    async alert(selectors,page) {
        if(selectors) {
            for(let i = 0; i < selectors.length; i++) {
                const selector = selectors[i]
                await Promise.race([
                    page.waitForNavigation(selector),
                    page.waitForTimeout(1500)
                ])
                const loaded = await page.evaluate((selector) => {
                    return document.querySelector(selector) ? true : false}, 
                    selector)
                if(loaded) { //Banner loaded
                    await page.click(selector)
                    await page.waitForTimeout(1000)
                }
            }
        }
    },
    async addProduct() {
        //Future
    },
    async logout(storage,page) {
        //Logout
        if(storage.urls.logout) { //URL
            await page.goto(storage.urls.logout);
        } else if (storage.options.special === 'APTEL') { // APTEL
            await page.evaluate(() => {
                javascript:__doPostBack('ctl00$ctl00$miBeleczkaGornaNowyLayout','logout')
            })
            await page.waitForNavigation()
        } else { //Button
            if(storage.selectors.preLogout) {
                await page.click(storage.selectors.preLogout)
                await page.waitForTimeout(200)
            }
            await page.evaluate((selector) => {
                document.querySelector(selector).click()}, 
                storage.selectors.logout)
        } 
    },
    async getPrices(products, storageName,hidden = false ) {
        const storage = wholesalers[storageName]
        
        const browser = await puppeteer.launch({
            headless: hidden,
            defaultViewport: {
                width: 1200,
                height: 600
            }
        })
        
        const page = await browser.newPage()
        if(storage) {
            try {
                await this.login(storage,page)
                await this.search(storage,page,products)
                await this.logout(storage,page)
                console.log(`${storageName} - complete`) 
            } catch (error) {
                browser.close()
                console.error(`${storageName} - error: ${error}`)
            }
        } else {
            console.log(`Not found storage ${storageName}`)
        }
        browser.close()
        return products;
    },
    updateProfit(product) {
        if(product.price.buy.brutto) {product.profit = profit.toProduct(product.price,product.tax_rate)}
        return product
    },
    nettoPrice(brutto,tax, place = 2) {
        return (brutto / (1 + tax / 100)).toFixed(place) * 1
    },
    bruttoPrice(netto,tax, place = 2) {
        return (netto * ( 1 + tax / 100)).toFixed(place) * 1
    },
    getStoragePrice(productPrice, priceHTML, tax, options){
        switch (options.position) {
            case 'left':
                priceHTML = priceHTML.slice(priceHTML.indexOf(options.word) + 1)
                break;
            case 'right':
                priceHTML = priceHTML.slice(0,priceHTML.indexOf(options.word)-1)
                break;
        }
        const price = priceHTML.replaceAll(',','.') * 1
        if (options.netto) {
            productPrice.netto = price || 0
            productPrice.brutto = this.bruttoPrice(price,tax) || 0
        } else {
            productPrice.netto = this.nettoPrice(price,tax) || 0
            productPrice.brutto =  price || 0
        }
        return productPrice
    }
}

module.exports = prices