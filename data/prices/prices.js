const puppeteer = require('puppeteer');

const wholesalers = require('./wholesalers')

const prices = {
    async getPrices (products, storageName) {
        const storage = wholesalers[storageName]
        //logowanie
        let login = storage.access.login;
        let password =  storage.access.password;
    
        //Pierwszy kierunek
        let loginUrl = storage.urls.login;
    
        //Url wylogowania
        let logoutUrl = storage.urls.logout;
    
        //poniżej wrzuć swoją ścieżkę do chrome, defaultowo jest w chromium
        let browser = await puppeteer.launch({
            headless: false
        });
    
        let page = await browser.newPage();
    
        await page.setViewport({ width: 1866, height: 768});
    
        if(storage.buttons.hasOwnProperty('extraCookies'))
        {
            await storage.extraCookieHandler(page);
        }
    
        await page.goto(loginUrl, {waitUntil: 'networkidle2'});
    
        if(storage.buttons.hasOwnProperty('notifications'))
        {
            await page.waitForSelector(storage.buttons.notifications);
            await page.click(storage.buttons.notifications)
        }
    
        if(!storage.hasOwnProperty('specialLoginActions'))
        {
            
            if(storage.buttons.hasOwnProperty('preLogin'))
            {
                await page.click(storage.buttons.prelogin);
            }
    
            await page.type(storage.selectors.toLogin, login);
            await page.type(storage.selectors.toPassword, password);
    
            await page.waitForSelector(storage.selectors.toWaitFor);
            if(storage.buttons.cookies!=''){
                    await page.click(storage.buttons.cookies);
            }
    
            await page.click(storage.buttons.login);
        }
        else
        {
            await storage.specialLoginAction(page)
        }
    
    
        if(storage.urls.search)
        {
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                });
    
            for(let i = 0; i < products.length; i++) 
            {
                const localProduct = products[i]; // Copy product
                let url = storage.urls.search + localProduct[storage.typeSearch];
                await page.goto(url, {waitUntil: 'networkidle2'});
                await page.waitForTimeout(500);
                const htmlText = await page.evaluate((selector) => {
                                 return document.querySelector(selector) ? document.querySelector(selector).textContent : false}, 
                                 storage.selectors.toPrice)
                localProduct.price.buy = await storage.getStoragePrice(localProduct.price.buy,htmlText) // Price from storage
    
                products[i] = await this.update(localProduct) // Profit update
            }
        } else if(storage.hasOwnProperty('remoteSearch')) {
            await page.goto(storage.urls.remoteSearch, {waitUntil: 'networkidle2'});
    
            for(let i = 0; i < products.length; i++) {
                const localProduct = products[i] // Copy product
                await page.waitForSelector(storage.selectors.search);
                page.type(storage.selectors.search,localProduct[storage.typeSearch])
                await page.waitForTimeout(2000);
                page.click(storage.buttons.search);
                await page.waitForTimeout(5000);
                const htmlText = await page.evaluate((selector) => {
                                 return document.querySelector(selector) ? document.querySelector(selector).textContent : false}, 
                                 storage.selectors.toPrice)
                localProduct.price.buy = await storage.getStoragePrice(localProduct.price.buy,htmlText) // Price from storage
    
                products[i] = await this.update(localProduct) // Profit update
            }
        }
        
        
        if(storage.urls.logout!='') {
            await page.goto(logoutUrl, {waitUntil: 'networkidle2'});
        }
    
        if(storage.buttons.hasOwnProperty('logout')) {
            await page.click(storage.buttons.logout);
        }
        await browser.close();
    
        return products;
    },
    getProfit(productPrice) {
        return productPrice.buy.brutto ? this.calculateProductProfit(productPrice) : 0
    },
    calculateDeliveryCosts(){
        return 0 // do uzupełnienia
    },
    calculateProductProfit(productPrice, vat) {
        vat=(vat/100).toFixed(2)*1
        let income_tax=((productPrice.sell.netto-productPrice.buy.netto)*0.09).toFixed(2)*1;
        let vat_tax=productPrice.sell.brutto-productPrice.sell.netto;
        let delivery_costs=this.calculateDeliveryCosts();
        let profit=(productPrice.sell.brutto-(productPrice.buy.netto+income_tax+vat_tax+delivery_costs)).toFixed(2)*1;
        return profit;
    },
    async update(product) {
        product.profit = this.getProfit(product.price)
        return product
    }
}

module.exports = prices