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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return parseFloat(document.querySelector(this.selectors.toPrice).textContent)
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
                if(this.selectors.toPrice)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            login:process.dotenv.action_login || '',
            password:process.dotenv.action_pass || ''
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            login:process.dotenv.bossoftoys_login || '',
            password:process.dotenv.bossoftoys_pass || ''
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
            toPrice:'#grid > div.table-wrapper > table > tbody > tr:nth-child(1) > td:nth-child(6)',
            search:'#txtSearchString'
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
    ombero:{
        urls:{
            login: 'https://ombero.pl/_login/index',
            search:'https://ombero.pl/q/?keywords=',
            logout:'https://ombero.pl/_login/logout'
        },
        access:{
            login:process.dotenv.ombero_login || '',
            password:process.dotenv.ombero_pass || ''
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            login:process.dotenv.vivab2b_login || '',
            password:process.dotenv.vivab2b_pass || ''
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            login:process.dotenv.ftoys_login || '',
            password:process.dotenv.ftoys_pass || ''
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            login:process.dotenv.b2btrade_login || '',
            employee:process.dotenv.b2btrade_employee || '',
            password:process.dotenv.b2btrade_pass || ''
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
            login:process.dotenv.telforceone_login || '',
            password:process.dotenv.telforceone_pass || ''
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
                if(document.querySelector(this.selectors.toPrice)!=null)
                {
                    return document.querySelector(this.selectors.toPrice).textContent;
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
            search:'https://lamex.pl/search/7611682290028',
            logout:'https://lamex.pl/logout'
        },
        access:{
            login:process.dotenv.lamex_login || '',
            password:process.dotenv.lamex_pass || ''
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
                if(document.querySelectorAll(this.selectors.toPrice)[1]!=null)
                {
                    return document.querySelectorAll(this.selectors.toPrice)[1].innerText;
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

}

module.exports=Wholesalers;