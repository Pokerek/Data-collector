const puppeteer = require('puppeteer');

const Wholesalers = require('./wholesalers')

const products = require('./products')


const getPrices = async (products, Wholesaler) => {
    
    //logowanie
    let login = Wholesaler.access.login;
    let password =  Wholesaler.access.password;

    //Pierwszy kierunek
    let loginUrl = Wholesaler.urls.login;

    //Url wylogowania
    let logoutUrl = Wholesaler.urls.logout;

    //poniżej wrzuć swoją ścieżkę do chrome, defaultowo jest w chromium
    let browser = await puppeteer.launch({
        headless: false
    });

    let page = await browser.newPage();

    await page.setViewport({ width: 1866, height: 768});

    if(Wholesaler.buttons.hasOwnProperty('extraCookies'))
    {
        await Wholesaler.extraCookieHandler(page);
    }

    await page.goto(loginUrl, {waitUntil: 'networkidle2'});

    if(Wholesaler.buttons.hasOwnProperty('notifications'))
    {
        await page.waitForSelector(Wholesaler.buttons.notifications);
        await page.click(Wholesaler.buttons.notifications)
    }

    if(!Wholesaler.hasOwnProperty('specialLoginActions'))
    {
        
        if(Wholesaler.buttons.hasOwnProperty('preLogin'))
        {
            await page.click(Wholesaler.buttons.prelogin);
        }

        await page.type(Wholesaler.selectors.toLogin, login);
        await page.type(Wholesaler.selectors.toPassword, password);

        await page.waitForSelector(Wholesaler.selectors.toWaitFor);
        if(Wholesaler.buttons.cookies!=''){
                await page.click(Wholesaler.buttons.cookies);
        }

        await page.click(Wholesaler.buttons.login);
    }
    else
    {
        await Wholesaler.specialLoginAction(page)
    }


    if(Wholesaler.urls.search)
    {
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            });

        for(let i = 0; i < products.length; i++) 
        {
            let url = Wholesaler.urls.search+products[i].ean;
            await page.goto(url, {waitUntil: 'networkidle2'});
            await page.waitForTimeout(500);
            let htmlText='';
            htmlText=await Wholesaler.priceGet(page);
            
            if(products[i].sku!='' && htmlText=='')
            {
                let url = Wholesaler.urls.search+products[i].sku;
                await page.goto(url, {waitUntil: 'networkidle2'});
                await page.waitForTimeout(500);
                htmlText=await Wholesaler.priceGet(page);
                
            }

            await Wholesaler.priceDressing(products, htmlText, i);
            //console.log(`Sell price: ${products[i].sell_price}\nBuy price: ${products[i].buy_price}\nSaldo: ${products[i].sell_price-products[i].buy_price}`);
            
            if(products[i].buy_price!=0)
            {
                products[i].saldo=(products[i].sell_price-products[i].buy_price).toFixed(2);
                products[i].saldo = parseFloat(products[i].saldo);
            }
        }
    }else if(Wholesaler.hasOwnProperty('remoteSearch'))
    {
        await page.goto(Wholesaler.urls.remoteSearch, {waitUntil: 'networkidle2'});

        for(let i = 0; i < products.length; i++) 
        {

            await page.waitForSelector(Wholesaler.selectors.search);

            page.type(Wholesaler.selectors.search,products[i].ean)
            await page.waitForTimeout(2000);
            page.click(Wholesaler.buttons.search);
            await page.waitForTimeout(5000);
            let htmlText='';
            htmlText=await Wholesaler.priceGet(page);
            
            if(products[i].sku!='' && htmlText=='')
            {
                page.type(Wholesaler.selectors.search,products[i].sku)
                await page.waitForTimeout(2000);
                page.click(Wholesaler.buttons.search);
                await page.waitForTimeout(5000);
                htmlText=await Wholesaler.priceGet(page);
            }

            await Wholesaler.priceDressing(products, htmlText, i);
            //console.log(`Sell price: ${products[i].sell_price}\nBuy price: ${products[i].buy_price}\nSaldo: ${products[i].sell_price-products[i].buy_price}`);
            
            if(products[i].buy_price!=0)
            {
                products[i].saldo=(products[i].sell_price-products[i].buy_price).toFixed(2);
                products[i].saldo = parseFloat(products[i].saldo);
            }
        }
    }
    
    
    if(Wholesaler.urls.logout!='')
    {
        await page.goto(logoutUrl, {waitUntil: 'networkidle2'});
    }

    if(Wholesaler.buttons.hasOwnProperty('logout'))
    {
        await page.click(Wholesaler.buttons.logout);
    }
    
    
    

    await browser.close();

    return products;
};



(async()=>{
    console.log(await getPrices(products, Wholesalers.abonline));
})();