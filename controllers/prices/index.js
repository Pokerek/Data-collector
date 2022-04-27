const wholesalers = require('./wholesalers')
const puppeteer = require('puppeteer')
const profit = require('./profit')
const missedList = require('../../scripts/logs/missedList')

const prices = {
    productsBuffor: [],
    localStorage: '',
    productIndex: 0,
    productError: 0,
    errorTime: 0,
    async login(page) {
        await page.goto(this.localStorage.urls.login, {waitUntil: 'networkidle2'});
        //Before alert
        await this.alert(this.localStorage.alerts.before,page)
        //Login
        if(this.localStorage.selectors.preLogin) { //Pre login button
            await page.click(this.localStorage.selectors.preLogin)
            await page.waitForTimeout(1000)
        }
        if(this.localStorage.selectors.employee) { //Special field in login form
            await page.type(this.localStorage.selectors.employee, this.localStorage.access.employee);
        }
        await page.type(this.localStorage.selectors.login, this.localStorage.access.login);
        await page.type(this.localStorage.selectors.password, this.localStorage.access.password)
        await Promise.all([ //Login submit
            page.click(this.localStorage.selectors.submit),
            await Promise.race([
                page.waitForNavigation({waitUntil: 'networkidle2'}),
                page.waitForTimeout(10000)
            ])
        ])

        //After alert
        await this.alert(this.localStorage.alerts.after,page)

        if(this.localStorage.options.special === 'APTEL') {
            await page.evaluate(() => {
                javascript:__doPostBack('ctl00','cookie_info_hide')
            })
            await page.waitForNavigation()
        }
    },
    async search(page) {
        // Wait for search reload
        if(this.localStorage.options.searchWait) {
            await page.waitForTimeout(500)
        }

        //Search
        for(this.productIndex; this.productIndex < this.productsBuffor.length; this.productIndex++) // For each product
        {
            const localProduct = this.productsBuffor[this.productIndex]; // Copy product
            let notFound = true
            for(let type of this.localStorage.typeSearch) { // Search for type
                await page.evaluate((selector) => { // Clear search field
                    document.querySelector(selector).value = ''
                },this.localStorage.selectors.search)
                if(localProduct[type] === '') { continue } // Empty search value
                await page.type(this.localStorage.selectors.search,localProduct[type])
                await page.waitForTimeout(300) // Wait after write
                if(this.localStorage.options.special === 'APTEL') {
                    await page.goto(`http://aptel.pl/ProduktyWyszukiwanie.aspx?search=${localProduct[type]}`)
                } else await page.keyboard.press('Enter')
                // Wait for search reload
                if(this.localStorage.options.searchWait) {
                    await page.waitForTimeout(this.localStorage.options.searchWait)
                } else {
                    await Promise.race([ //Timeout or page load
                        page.waitForNavigation({waitUntil: 'networkidle2'}),
                        page.waitForTimeout(5000)
                    ])
                }
                if(this.localStorage.options.table) {
                    const found = await page.evaluate((selector) => {
                        return document.querySelector(selector).childElementCount}, 
                        this.localStorage.selectors.table)
                    if (!found) continue // If not found search for next type
                } else {
                    await Promise.race([ // Found or not
                        page.waitForSelector(this.localStorage.selectors.name),
                        page.waitForSelector(this.localStorage.selectors.notFound)
                    ])
                }
                if(this.localStorage.options.special === "ORNO") {
                    await page.click('.box-body > table > tbody > tr > td.align-middle.text-center > a > i')
                    await page.waitForSelector(this.localStorage.selectors.price)
                }
                const htmlText = await page.evaluate((priceSelector,pricePos,nameSelector,nameProduct) => {
                    const priceBox = document.querySelectorAll(priceSelector)
                    const length = priceBox.length
                    //ToDo testing name of searching product
                    if(length) {
                        if(priceBox[pricePos]) {
                            return priceBox[pricePos].innerText
                        } else {
                            return priceBox[0].innerText
                        }
                    } else {
                        return false
                    }
                }, this.localStorage.selectors.price,this.localStorage.selectors.pricePos,this.localStorage.selectors.name,localProduct.name)
                if(htmlText) {
                    let quantity = 1
                    if(this.localStorage.options.special === 'LECHPOL') { //Quantity for lechpol
                        quantity = await page.evaluate(() => {
                            let quantityText = document.querySelector(".qty-multiplier strong")
                            if(quantityText) {
                                return quantityText.innerHTML * 1
                            }
                            return 1
                        })
                    }
                    localProduct.price[0].buy = this.getStoragePrice(localProduct.price[0].buy,htmlText,localProduct.tax_rate,this.localStorage.priceOptions,quantity) // Price from storage
                    notFound = false
                    break
                }
            }
            if(notFound) {
                missedList.add(localProduct,'Not found')
            } else {
                this.productsBuffor[this.productIndex] = this.updateProfit(localProduct) // Profit update
            }
        }    
    },
    async alert(selectors,page) {
        if(selectors) {
            for(let i = 0; i < selectors.length; i++) {
                const selector = selectors[i]
                page.waitForTimeout(1500)
                let check_selector = await page.evaluate(() => {
                            return document.querySelector(selector)
                        }, selector)

                if(check_selector)
                {
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
        }
    },
    async addProduct() {
        //Future
    },
    async logout(page) {
        //Logout
        if(this.localStorage.urls.logout) { //URL
            await page.goto(this.localStorage.urls.logout);
        } else if (this.localStorage.options.special === 'APTEL') { // APTEL
            await page.evaluate(() => {
                javascript:__doPostBack('ctl00$ctl00$miBeleczkaGornaNowyLayout','logout')
            })
            await page.waitForNavigation()
        } else { //Button
            if(this.localStorage.selectors.preLogout) {
                await page.click(this.localStorage.selectors.preLogout)
                await page.waitForTimeout(200)
            }
            await page.evaluate((selector) => {
                document.querySelector(selector).click()}, 
                this.localStorage.selectors.logout)
        }
    },
    async getPrices(products, storageName,hidden = false) {
        this.localStorage = wholesalers[storageName]
        this.productsBuffor = products
        this.productIndex = 0
        this.productError = 0 
        this.errorTime = 0 

        const browser = await puppeteer.launch({
            headless: hidden,
            defaultViewport: {
                width: 1200,
                height: 600
            }
        })
        
        const page = await browser.newPage()

        if(this.localStorage) {
            do {
                await this.priceLoop(page)
            } while (this.productIndex < this.productsBuffor.length)
            console.log(`${storageName} - search complete. Total error products: ${this.productError}`)
        } else {
            console.log(`Not found storage ${storageName}`)
        }
        browser.close()
        return this.productsBuffor;
    },
    async priceLoop(page) {
        try {
            await this.login(page)
            await this.search(page)
            await this.logout(page)
        } catch (error) {
            if(this.errorTime === 2) {
                this.errorTime = 0
                this.productIndex++
                this.productError++
            } else {
                this.errorTime++ // Interaction for error
            }
        }
    },
    updateProfit(product) {
        if(product.price[0].buy.brutto) {product.profit = profit.toProduct(product.price[0],product.tax_rate)}
        return product
    },
    nettoPrice(brutto,tax, place = 2) {
        return (brutto / (1 + tax / 100)).toFixed(place) * 1
    },
    bruttoPrice(netto,tax, place = 2) {
        return (netto * ( 1 + tax / 100)).toFixed(place) * 1
    },
    getStoragePrice(productPrice, priceHTML, tax, options,quantity = 1){
        if(options.position.left) {
            priceHTML = priceHTML.slice(priceHTML.indexOf(options.position.left) + 1)
        }
        if(options.position.right) {
            priceHTML = priceHTML.slice(0,priceHTML.indexOf(options.position.right)-1)
        }
        const price = parseFloat(priceHTML.replaceAll(',','.')) * quantity
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