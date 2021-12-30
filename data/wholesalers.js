require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

const Wholesalers={
    hurtel:{
        urls:{
            login: 'https://b2b.hurtel.com/pl/signin.html',
            search:'https://b2b.hurtel.com/pl/search.html?text=',
            logout:'https://b2b.hurtel.com/login.php?operation=logout'
        },
        access:{
            login:process.env.hurtel_login || '',
            password:process.env.hurtel_pass || '',
        },
        buttons:{
            cookies:'#ckdsclmrshtdwn_v2 > span',
            login:'div.signin_buttons.col-md-10.col-12 > button',
        },
        selectors:{
            toWaitFor:'#ckdsclmrshtdwn_v2 > span',
            toLogin:'#user_login',
            toPassword:'#user_pass',
            toPrice:'#search > div > div.product__prices > strong.price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("#search > div > div.product__prices > strong")!=null)
                {
                    return document.querySelector("#search > div > div.product__prices > strong.price").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    partnertele:{
        urls:{
            login: 'https://hurtownia.partnertele.com/pl/user/login',
            search:'https://hurtownia.partnertele.com/pl/product/search?q=',
            logout:'https://hurtownia.partnertele.com/pl/user/logout'
        },
        access:{
            login:process.env.partnertele_login || '',
            password:process.env.partnertele_pass || ''
        },
        buttons:{
            cookies:'',
            login:'#submitBtn',
        },
        selectors:{
            toWaitFor:'#password',
            toLogin:'#login',
            toPassword:'#password',
            toPrice:'#price-count'
        },

        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#price-count')!=null)
                {
                    return parseFloat(document.querySelector('#price-count').textContent)
                } else return '';
                
                
            })
        },

        priceDressing(products, htmlText, index){
            if(isNaN(htmlText))
            {
                products[index].buy_price = parseFloat(htmlText);
                products[index].buy_price = (products[index].buy_price*1.23).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            }else{
                products[index].buy_price = 0;
            }

            return products;
        }
    },
    annapol:{
        urls:{
            login: 'https://www.annapol.com/login.php',
            search:'https://www.annapol.com/advanced_search_result.php?keywords=',
            logout:'https://www.annapol.com/logoff.php'
        },
        access:{
            login:process.env.annapol_login || '',
            password:process.env.annapol_pass || ''
        },
        buttons: {
            extraCookies:'#cookies_info > p > a.close',
            cookies:'',
            login:'tbody > tr > td > table:nth-child(2) > tbody > tr > td > input[type=image]',
        },
        selectors:{
            toWaitFor:'tbody > tr > td > table:nth-child(2) > tbody > tr > td > input[type=image]',
            toLogin:'tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]',
            toPassword:'tbody > tr:nth-child(2) > td:nth-child(2) > input[type=password]',
            toPrice:'#search > div > div.product__prices > strong.price'
        },
        

        async extraCookieHandler(page){
            let loginUrl = this.urls.login;
            await page.goto(loginUrl, {waitUntil: 'networkidle2'});
            await page.evaluate(()=>{
                return document.querySelector('#cookies_info > p > a.close').click();
            })
            await page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        },

        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("tbody > tr > td:nth-child(1) > p.cena > span")!=null)
                {
                    return document.querySelector("tbody > tr > td:nth-child(1) > p.cena > span").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('EUR')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price*1.23).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);

            } else {
                products[index].buy_price = 0;
            }

            return products;
        }
    },
    epstryk:{
        urls:{
            login: 'https://epstryk.pl/login.php',
            search:'https://epstryk.pl/search.php?text=',
            logout:'https://epstryk.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.epstryk_login || '',
            password:process.env.epstryk_pass || ''
        },
        buttons: {
            cookies:'#ckdsclmrshtdwn_v2 > span',
            login:'div.signin_buttons.col-md-10.col-xs-12 > button',
        },
        selectors:{
            toWaitFor:'#ckdsclmrshtdwn_v2 > span',
            toLogin:'#user_login',
            toPassword:'#user_pass',
            toPrice:'#search > div > div.product__prices > strong.price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("#search > div > div > div.product_prices > span")!=null)
                {
                    return document.querySelector("#search > div > div > div.product_prices > span").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }           

                products[index].buy_price = (products[index].buy_price*1.23).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
                
            } else {
                products[index].buy_price = 0;
            }

            return products;
        }
    },
    dmtrade:{
        urls:{
            login: 'https://www.dmtrade.pl/logowanie.html',
            search:'https://www.dmtrade.pl/index.php?d=szukaj&szukaj=',
            logout:'https://www.dmtrade.pl/lo.php?g=out'
        },
        access:{
            login:process.env.dmtrade_login || '',
            password:process.env.dmtrade_pass || ''
        },
        buttons: {
            cookies:'button.cc-nb-okagree',
            login:'input.button',
        },
        selectors:{
            toWaitFor:'button.cc-nb-okagree',
            toLogin:'input[name=umail]',
            toPassword:'input[name=password]',
            toPrice:'span.tax > span'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("span.tax > span")!=null)
                {
                    return document.querySelector("span.tax > span").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {      
                products[index].buy_price = parseFloat(htmlText);
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    gadgetmaster:{
        urls:{
            login: 'https://gadget-master.pl/signin.php',
            search:'https://gadget-master.pl/search.php?text=',
            logout:'https://gadget-master.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.gadgetmaster_login || '',
            password:process.env.gadgetmaster_pass || ''
        },
        buttons: {
            cookies:'#ckdsclmrshtdwn_v2 > span',
            login:'div.signin_buttons.col-md-10.col-12 > button',
        },
        selectors:{
            toWaitFor:'#ckdsclmrshtdwn_v2 > span',
            toLogin:'#user_login',
            toPassword:'#user_pass',
            toPrice:'strong.price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("strong.price")!=null)
                {
                    return document.querySelector("strong.price").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    /*abonline:{
        urls:{
            login: 'https://www.abonline.pl/',
            search:'https://www.abonline.pl/offer/pl/0/#/list/?srch=',
            logout:''
        },
        access:{
            login:process.env.abonline_login || '',
            password:process.env.abonline_pass || ''
        },
        buttons: {
            cookies:'#accept_cookie',
            login:'#jsBtnSiteLogin',
            search:'#btnSearchBoxSearch',
            logout:'#divLogout > div.logoutBtn > form > button'
        },
        selectors:{
            toSearch:'#inpSearchBoxPhrase',
            toWaitFor:'#jsBtnSiteLogin',
            toLogin:'#jsFrmLoginLogin',
            toPassword:'#jsFrmLoginPass',
            toPrice:'#productGrossPriceID > div > span'
        },
        specialEncryption:true,

        encrypt(val)
        {
            return (Buffer.from(val).toString('base64')).replaceAll('=','%7Beq%7D')
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#productGrossPriceID > div > span')!=null)
                {
                    return document.querySelector('#productGrossPriceID > div > span').textContent;
                } else return '';
                
                
            })
        },

        priceDressing(products, htmlText, index){
            if(isNaN(htmlText))
            {
                products[index].buy_price = parseFloat(htmlText);
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            }else{
                products[index].buy_price = 0;
            }

            return products;
        }
    },*/
    tayma:{
        urls:{
            login: 'https://tayma.pl/pl/signin.html',
            search:'https://tayma.pl/pl/noproduct.html?reason=product&text=',
            logout:'https://tayma.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.tayma_login || '',
            password:process.env.tayma_pass || ''
        },
        buttons: {
            cookies:'#ckdsclmrshtdwn_v2 > span',
            login:'div.signin_buttons.col-md-10.col-12 > button',
        },
        selectors:{
            toWaitFor:'#ckdsclmrshtdwn_v2 > span',
            toLogin:'#user_login',
            toPassword:'#user_pass',
            toPrice:'#projector_price_value'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("#search > div > div.product__prices > strong")!=null)
                {
                    return document.querySelector("#search > div > div.product__prices > strong.price").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    action:{
        urls:{
            login: 'https://is3.action.pl/user/signin',
            search:'https://is3.action.pl/products?keyword=',
            logout:'https://is3.action.pl/user/signout'
        },
        access:{
            login:process.dotenv.action_login,
            password:process.dotenv.action_pass
        },
        buttons: {
            cookies:'',
            login:'#login-submit-button',
        },
        selectors:{
            toWaitFor:'#login-submit-button',
            toLogin:'#UserName',
            toPassword:'#Password',
            toPrice:'#projector_price_value'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("#search > div > div.product__prices > strong")!=null)
                {
                    return document.querySelector("#search > div > div.product__prices > strong.price").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    bossoftoys:{
        urls:{
            login: 'https://b2b.bossoftoys.pl/',
            search:'https://is3.action.pl/products?keyword=',
            logout:'https://b2b.bossoftoys.pl/index.php/logout'
        },
        access:{
            login:process.dotenv.bossoftoys_login,
            password:process.dotenv.bossoftoys_pass
        },
        buttons: {
            cookies:'',
            login:'#content > div.login > form > fieldset > div > div.col-md-12.text-right > button',
        },
        selectors:{
            toWaitFor:'#login',
            toLogin:'#login',
            toPassword:'#password',
            toPrice:'#grid > div.table-wrapper > table > tbody > tr:nth-child(1) > td:nth-child(6)'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("#search > div > div.product__prices > strong")!=null)
                {
                    return document.querySelector("#search > div > div.product__prices > strong.price").textContent;
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))* 1.23 / 100
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2) * 1.23
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
}

module.exports=Wholesalers;