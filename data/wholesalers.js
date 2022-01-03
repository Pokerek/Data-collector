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
                if(document.querySelector('#search > div > div.product__prices > strong.price')!=null)
                {
                    return document.querySelector('#search > div > div.product__prices > strong.price').textContent;
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
            await page.waitForSelector(this.buttons.extraCookies);
            await page.click(this.buttons.extraCookies);
        },

        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#search > div > div.product__prices > strong.price')!=null)
                {
                    return document.querySelector('#search > div > div.product__prices > strong.price').textContent;
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
                if(document.querySelector('#search > div > div.product__prices > strong.price')!=null)
                {
                    return document.querySelector('#search > div > div.product__prices > strong.price').textContent;
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
                if(document.querySelector('span.tax > span')!=null)
                {
                    return document.querySelector('span.tax > span').textContent;
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
                if(document.querySelector('strong.price')!=null)
                {
                    return document.querySelector('strong.price').textContent;
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
    abonline:{
        urls:{
            login: 'https://www.abonline.pl/',
            remoteSearch:'https://www.abonline.pl/offer/pl/0/#/list/?srch=',
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
            logout:'.btnTopLogout',
            search:'#btnSearchBoxSearch'
        },
        selectors:{
            toSearch:'#inpSearchBoxPhrase',
            toWaitFor:'#jsBtnSiteLogin',
            toLogin:'#jsFrmLoginLogin',
            toPassword:'#jsFrmLoginPass',
            toPrice:'#productGrossPriceID > div > span',
            search:'#inpSearchBoxPhrase'
        },
        remoteSearch:true,
        
        async priceGet(page){
            await page.waitForTimeout(500);
            await page.evaluate( () => document.querySelector("#inpSearchBoxPhrase").value = "")
            return await page.evaluate(()=>{
                if(document.querySelector('#productGrossPriceID > div > span')!=null)
                {
                    return document.querySelector('#productGrossPriceID > div > span').innerText;
                } else return '';
                
                
            })
        },

        priceDressing(products, htmlText, index){
            if(htmlText !='')
            {
                products[index].buy_price = htmlText.slice(0,htmlText.indexOf('zł')-1);
                products[index].buy_price = parseFloat(products[index].buy_price);
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            }else{
                products[index].buy_price = 0;
            }

            return products;
        }
    },
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
                if(document.querySelector('#projector_price_value')!=null)
                {
                    return document.querySelector('#projector_price_value').textContent;
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
            login:process.env.action_login || '',
            password:process.env.action_pass || ''
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
                if(document.querySelector('#projector_price_value')!=null)
                {
                    return document.querySelector('#projector_price_value').textContent;
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
            remoteSearch:'https://b2b.bossoftoys.pl/index.php/cennik',
            logout:'https://b2b.bossoftoys.pl/index.php/logout'
        },
        access:{
            login:process.env.bossoftoys_login || '',
            password:process.env.bossoftoys_pass || ''
        },
        buttons: {
            cookies:'',
            login:'#content > div.login > form > fieldset > div > div.col-md-12.text-right > button',
            search:'#btnSearch'
        },
        selectors:{
            toWaitFor:'#login',
            toLogin:'#login',
            toPassword:'#password',
            toPrice:'.responsive-details-value-inner',
            search:'#txtSearchString'
        },
        remoteSearch:true,
        
        async priceGet(page){
            await page.waitForTimeout(500);
            await page.evaluate( () => document.querySelector("#txtSearchString").value = "")
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.responsive-details-value-inner')[5]!=null)
                {
                    return document.querySelectorAll('.responsive-details-value-inner')[5].textContent
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
    ombero:{
        urls:{
            login: 'https://ombero.pl/_login/index',
            search:'https://ombero.pl/q/?keywords=',
            logout:'https://ombero.pl/_login/logout'
        },
        access:{
            login:process.env.ombero_login || '',
            password:process.env.ombero_pass || ''
        },
        buttons: {
            cookies:'#topInfo0 > div:nth-child(3)',
            login:'#login_bt',
        },
        selectors:{
            toWaitFor:'#topInfo0 > div:nth-child(3)',
            toLogin:'#login',
            toPassword:'#pass',
            toPrice:'#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)')!=null)
                {
                    return document.querySelector('#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)').textContent;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText
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
    vivab2b:{
        urls:{
            login: 'https://vivab2b.pl/konto.html?redirect=YTowOnt9',
            search:'https://vivab2b.pl/?f=&a=sklep&k=0&q=',
            logout:'https://vivab2b.pl/?a=klient.logout'
        },
        access:{
            login:process.env.vivab2b_login || '',
            password:process.env.vivab2b_pass || ''
        },
        buttons: {
            cookies:'#selly-cookies > div > a',
            login:'#login-box > form > ul > li:nth-child(3) > input',
        },
        selectors:{
            toWaitFor:'#selly-cookies > div > a',
            toLogin:'#llogin',
            toPassword:'#lpassword',
            toPrice:'body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong')!=null)
                {
                    return document.querySelector('body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong').textContent;
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

    ftoys:{
        urls:{
            login: 'https://ftoys.pl/logowanie',
            search:'https://ftoys.pl/p?szukane=',
            logout:'https://ftoys.pl/logout'
        },
        access:{
            login:process.env.ftoys_login || '',
            password:process.env.ftoys_pass || ''
        },
        buttons: {
            cookies:'#CookieAlertClose',
            login:'#login-form > div.form-group.sekcja-przyciski.mb-0.d-flex > div.form-group.ml-auto.mt-auto.d-flex.mb-0 > button',
        },
        selectors:{
            toWaitFor:'#CookieAlertClose',
            toLogin:'#Uzytkownik',
            toPassword:'#Haslo',
            toPrice:'#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto')!=null)
                {
                    return document.querySelector('#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto').textContent;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    b2btrade:{
        urls:{
            login: 'http://b2btrade.eu/',
            search:'http://b2btrade.eu/ItemsCatalog?searchString=',
            logout:'http://b2btrade.eu/Account/Logout'
        },
        access:{
            login:process.env.b2btrade_login || '',
            employee:process.env.b2btrade_employee || '',
            password:process.env.b2btrade_pass || ''
        },
        buttons: {
            cookies:'#selly-cookies > div > a',
            login:'#login-box > form > ul > li:nth-child(3) > input',
            prelogin:'#main > div.header-container.clearfix > div.header-menu-info-container > div.clearfix > button:nth-child(2)'
        },
        selectors:{
            toWaitFor:'#selly-cookies > div > a',
            toLogin:'#Login',
            toEmployee:'#UserName',
            toPassword:'#Password',
            toPrice:'special'
        },
        specialLoginActions:true,
        
        async specialLoginAction(page){
            await page.click(this.buttons.prelogin);
            await page.type(this.selectors.toLogin, login);
            await page.type(this.selectors.toEmployee, employee);
            await page.type(this.selectors.toPassword, password);
            await page.click(this.buttons.login);
        },

        async priceGet(page){
            return await page.evaluate(()=>{
                if ((document.querySelectorAll('.rwd-col-0')[5]).textContent!=null)
                {
                    return document.querySelectorAll('.rwd-col-0')[5].textContent;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.replaceAll('PLN ','')
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
    
    telforceone:{
        urls:{
            login: 'https://sklep.telforceone.pl/',
            search:'https://sklep.telforceone.pl/pl-pl/szukaj?page=1&w=11&i=12&d=0&s=5&c=0&t=',
            logout:'https://sklep.telforceone.pl/pl-pl/#'
        },
        access:{
            login:process.env.telforceone_login || '',
            password:process.env.telforceone_pass || ''
        },
        buttons: {
            cookies:'',
            login:'#loginButton',
            prelogin:'#menu_open > section.top-nav.luk > div > aside > nav > div > div > div > div.pasupr > div > a.ml20.login.logout-button'
        },
        selectors:{
            toWaitFor:'#menu_open > section.top-nav.luk > div > aside > nav > div > div > div > div.pasupr > div > a.ml20.login.logout-button',
            toLogin:'#headerLoginUser',
            toPassword:'#headerLoginPass',
            toPrice:'#gridView > li > div.fr.mt22 > span'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#gridView > li > div.fr.mt22 > span')!=null)
                {
                    return document.querySelector('#gridView > li > div.fr.mt22 > span').textContent;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }      
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    lamex:{
        urls:{
            login: 'https://lamex.pl/login',
            search:'https://lamex.pl/search/',
            logout:'https://lamex.pl/logout'
        },
        access:{
            login:process.env.lamex_login || '',
            password:process.env.lamex_pass || ''
        },
        buttons: {
            cookies:'#cookies > div > a',
            login:'#register > fieldset > div:nth-child(5) > input',
        },
        selectors:{
            toWaitFor:'#cookies > div > a',
            toLogin:'#signin_username',
            toPassword:'#signin_password',
            toPrice:'.price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.price')[1]!=null)
                {
                    return document.querySelectorAll('.price')[1].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    lechpol:{
        urls:{
            login: 'https://www.lechpol.pl/pl/login',
            search:'https://www.lechpol.pl/pl/query/',
            logout:'https://www.lechpol.pl/pl/logout'
        },
        access:{
            login:process.env.lechpol_login || '',
            password:process.env.lechpol_pass || ''
        },
        buttons: {
            extraCookies:'div.modal-footer > button',
            notifications:'button.wpc_w_f_c_b.wpc_w_f_c_b-n',
            cookies:'',
            login:'#my-page > div > div > div.col-12.col-lg-6.offset-lg-1 > form > div.text-center.d-sm-flex.mb-5.align-items-center.justify-content-between > button',
        },
        selectors:{
            toWaitFor:'',
            toLogin:'#login_email',
            toPassword:'#login_password',
            toPrice:''
        },

        async extraCookieHandler(page){
            let loginUrl = this.urls.login;
            await page.goto(loginUrl, {waitUntil: 'networkidle2'});
            await page.waitForSelector(this.buttons.extraCookies);
            await page.click(this.buttons.extraCookies);
            
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.price')[3]!=null)
                {
                    return document.querySelectorAll('.price')[3].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    
    amio:{
        urls:{
            login: 'https://amio.pl/logowanie/7',
            search:'https://amio.pl/produkty/2?search=',
            logout:''
        },
        access:{
            login:process.env.amio_login || '',
            password:process.env.amio_pass || ''
        },
        buttons: {
            cookies:'body > footer > div.message-popup-ui.cookie-notice-ui.box-ui.message-popup-lq.bottom-ui > i',
            login:'#main > div > div > div > div > button > span',
            logout:'body > header > div.header-ui-line-bg > div > ul > li.last-ui.f-right-ui > div > button > span > span'
        },
        selectors:{
            toWaitFor:'body > footer > div.message-popup-ui.cookie-notice-ui.box-ui.message-popup-lq.bottom-ui > i',
            toLogin:'#main > div > div > div > div > div:nth-child(2) > input',
            toPassword:'#main > div > div > div > div > div.login-password-container-ui > input',
            toPrice:'.price-ui'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.price-ui')[0]!=null)
                {
                    return document.querySelectorAll('.price-ui')[0].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    fddistribution:{
        urls:{
            login: 'https://fd-distribution.pl/konto.html?redirect=YTowOnt9',
            search:'https://fd-distribution.pl/?f=&a=sklep&k=0&x=0&y=0&q=',
            logout:'https://fd-distribution.pl/a?klient.logout'
        },
        access:{
            login:process.env.fddistribution_login || '',
            password:process.env.fddistribution_pass || ''
        },
        buttons: {
            cookies:'#selly-cookies > div > a',
            login:'#login-box > form > ul > li:nth-child(3) > input',
        },
        selectors:{
            toWaitFor:'#selly-cookies > div > a',
            toLogin:'#llogin',
            toPassword:'#lpassword',
            toPrice:'.price-ui'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('span.item.itemAdd > strong')!=null)
                {
                    return document.querySelector('span.item.itemAdd > strong').innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },
    
    aptel:{
        urls:{
            login: 'http://aptel.pl/Default.B2B.aspx',
            search:'http://aptel.pl/ProduktyWyszukiwanie.aspx?search=',
            logout:''
        },
        access:{
            login:process.env.aptel_login || '',
            password:process.env.aptel_pass || ''
        },
        buttons: {
            cookies:'#cookies_info_close_pl',
            login:'#ctl00_MainContent_btZaloguj_Button',
            logout:'#belkaGornaNL_wyloguj > a'
        },
        selectors:{
            toWaitFor:'#cookies_info_close_pl',
            toLogin:'#ctl00_MainContent_tbLogin',
            toPassword:'#ctl00_MainContent_tbHaslo',
            toPrice:''
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll("em")[11]!=null)
                {
                    return document.querySelectorAll("em")[11].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    iks2:{
        urls:{
            login: 'https://iks2.pl/pl/order/login.html',
            search:'https://iks2.pl/pl/szukaj/?search_lang=pl&search=product&string=',
            logout:'https://iks2.pl/pl/order/logout.html'
        },
        access:{
            login:process.env.iks2_login || '',
            password:process.env.iks2_pass || ''
        },
        buttons: {
            cookies:'',
            login:'#login_form > div > div.orderForm__buttons.orderForm__buttons--pt.row.h_end > label',
        },
        selectors:{
            toWaitFor:'',
            toLogin:'#login_form > div > div:nth-child(1) > div > div.orderForm__field > input',
            toPassword:'#login_form > div > div:nth-child(2) > div > div.orderForm__field > input',
            toPrice:'span.productFull__quick_infoBox--price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('span.productFull__quick_infoBox--price')[0]!=null)
                {
                    return document.querySelectorAll('span.productFull__quick_infoBox--price')[0].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('ZŁ')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    sonia:{
        urls:{
            login: 'https://b2b.sonia.pl/',
            remoteSearch:'https://b2b.sonia.pl/katalog.html',
            logout:'https://b2b.sonia.pl/wyloguj.html'
        },
        access:{
            login:process.env.sonia_login || '',
            password:process.env.sonia_pass || ''
        },
        buttons: {
            cookies:'',
            login:'#logowanie > form > table > tbody > tr:nth-child(1) > td:nth-child(6) > input',
            search:'body > center > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(8) > form > p > input.zakres-nazwa-button'
        },
        selectors:{
            toWaitFor:'',
            toLogin:'#log_email',
            toPassword:'#log_paswd',
            toPrice:'document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0]',
            search:'body > center > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(8) > form > p > input.zakres-nazwa-text'
        },
        remoteSearch:true,
        
        async priceGet(page){
            await page.waitForTimeout(500);
            await page.evaluate( () => document.querySelector("body > center > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(8) > form > p > input.zakres-nazwa-text").value = "")
            return await page.evaluate(()=>{
                if(document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0]!=null)
                {
                    return document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0].innerText
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    silit:{
        urls:{
            login: 'https://silit.abstore.pl/client/loginorcreate/login/',
            search:'https://silit.abstore.pl/search/text=',
            logout:'https://silit.abstore.pl/client/logout/'
        },
        access:{
            login:process.env.silit_login || '',
            password:process.env.silit_pass || ''
        },
        buttons: {
            cookies:'#cookie-policy-remove-button',
            login:'#login_id',
            search:'#searchForm_cartPreview > div > div.input-group > span > button > span'
        },
        selectors:{
            toWaitFor:'#cookie-policy-remove-button',
            toLogin:'#email_id',
            toPassword:'#password_id',
            toPrice:'',
            search:'#searchInput_cartPreview'
        },
        remoteSearch:true,
        
        async priceGet(page){
            await page.waitForTimeout(500);
            await page.evaluate( () => document.querySelector("#searchInput_cartPreview").value = "")
            return await page.evaluate(()=>{
                if(document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0]!=null)
                {
                    return document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0].innerText
                } else return '';
                
                
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('ZŁ')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    /*panda:{
        urls:{
            login: '',
            search:'',
            logout:''
        },
        access:{
            login:process.env._login || '',
            password:process.env._pass || ''
        },
        buttons: {
            cookies:'',
            login:'',
            search:''
        },
        selectors:{
            toWaitFor:'',
            toLogin:'',
            toPassword:'',
            toPrice:'',
            search:''
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('span.productFull__quick_infoBox--price')[0]!=null)
                {
                    return document.querySelectorAll('span.productFull__quick_infoBox--price')[0].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('ZŁ')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },*/ //ich strona nie jest gotowa
    
    orno:{
        urls:{
            login: 'https://b2b.orno.pl/',
            search:'https://b2b.orno.pl/search?q=',
            logout:'https://b2b.orno.pl/logout'
        },
        access:{
            login:process.env.orno_login || '',
            password:process.env.orno_pass || ''
        },
        buttons: {
            cookies:'',
            login:'body > div.container > div > div > div > div > form > div.row > div > button',
        },
        selectors:{
            toWaitFor:'body > div.container > div > div > div > div > form > div.row > div > button',
            toLogin:'#inputEmail',
            toPassword:'#inputPassword',
            toPrice:'div.product-show__price-value',
        },
        
        async priceGet(page){
            if(document.querySelector("body > div > div > section.content > div > div:nth-child(3) > div > div > div.box-body > table > tbody > tr:nth-child(1) > td:nth-child(2) > a")!=null)
            {
                page.click(document.querySelector("body > div > div > section.content > div > div:nth-child(3) > div > div > div.box-body > table > tbody > tr:nth-child(1) > td:nth-child(2) > a"))
                await page.waitForNavigation({
                    waitUntil: 'networkidle2',
                    });
            }
            
            return await page.evaluate(()=>{
                if(document.querySelector("div.product-show__price-value")!=null)
                {
                    return document.querySelector("div.product-show__price-value").innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('ZŁ')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },


    eet:{
        urls:{
            login: 'https://www.eetgroup.com/pl-pl',
            search:'https://www.eetgroup.com/pl-pl/?term=',
            logout:'https://www.eetgroup.com/pl-pl/my-account/profile'
        },
        access:{
            login:process.env.eet_login || '',
            password:process.env.eet_pass || ''
        },
        buttons: {
            extraCookies:'#coiPage-2 > div.coi-banner__page-footer > button:nth-child(3)',
            notifications:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > button',
            cookies:'',
            login:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > button',
            logout:'body > div:nth-child(4) > div.flex.flex-col.bg-gray-300 > div > main > article > aside > section > div > ul:nth-child(5) > li > button',
            prelogin:'body > div:nth-child(4) > div.flex.flex-col.bg-gray-300 > div > header > div > div.top-header-wrapper > div > article > div > div > div.header-nav-buttons > button > span > span'
        },
        selectors:{
            toWaitFor:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > button',
            toLogin:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > div.mt-20 > div > label',
            toPassword:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > div.mt-10 > div > label',
            toPrice:'p.text-black.font-bold.text-14.uppercase',
        },
        
        async extraCookieHandler(page){
            let loginUrl = this.urls.login;
            await page.goto(loginUrl, {waitUntil: 'networkidle2'});
            await page.waitForSelector(this.buttons.extraCookies);
            await page.click(this.buttons.extraCookies);
        },

        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("p.text-black.font-bold.text-14.uppercase")!=null)
                {
                    return document.querySelector("p.text-black.font-bold.text-14.uppercase").innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('PLN')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    k2:{
        urls:{
            login: 'https://k2distribution.pl/login/',
            search:'https://k2distribution.pl/category/?q=',
            logout:''
        },
        access:{
            login:process.env.k2_login || '',
            //password:process.env.k2_pass || ''
        },
        buttons: {
            cookies:'',
            login:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(2) > input',
        },
        selectors:{
            toWaitFor:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(2) > input',
            toLogin:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(1) > input',
            toPassword:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(2) > input',
            toPrice:'',
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('span.productFull__quick_infoBox--price')[0]!=null)
                {
                    return document.querySelectorAll('span.productFull__quick_infoBox--price')[0].innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('ZŁ')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
                }
                
                products[index].buy_price = (products[index].buy_price).toFixed(2);
                products[index].buy_price = parseFloat(products[index].buy_price);
            } else {
                products[index].buy_price = 0;
            }
            
            return products;
        }
    },

    homescreen:{
        urls:{
            login: 'https://b2b.homescreen.pl/logowanie?back=my-account',
            search:'https://b2b.homescreen.pl/module/iqitsearch/searchiqit?s=',
            logout:'https://b2b.homescreen.pl/?mylogout='
        },
        access:{
            login:process.env.homescreen_login || '',
            password:process.env.homescreen_pass || ''
        },
        buttons: {
            cookies:'',
            login:'#submit-login',
        },
        selectors:{
            toWaitFor:'#submit-login',
            toLogin:'#field-email',
            toPassword:'#field-password',
            toPrice:'document.querySelector("div.product-price-and-shipping > span").innerText',
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("div.product-price-and-shipping > span")!=null)
                {
                    return document.querySelector("div.product-price-and-shipping > span").innerText;
                } else return '';
            })
        },
        
        priceDressing(products, htmlText, index){
            if(htmlText !='') {
                const priceText = htmlText.slice(0,htmlText.indexOf('zł')-1)
                
                if(priceText[0] == '0') {
                    products[index].buy_price = parseFloat(priceText.slice(2))
                } else {
                    products[index].buy_price = parseFloat(priceText).toFixed(2)
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