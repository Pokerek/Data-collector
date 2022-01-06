require('dotenv').config({path:'../.env'})

const wholesalers = {
    HURTEL:{
        urls:{
            login: 'https://b2b.hurtel.com/pl/signin.html',
            logout:'https://b2b.hurtel.com/login.php?operation=logout'
        },
        access:{
            login:process.env.hurtel_login || '',
            password:process.env.hurtel_pass || '',
        },
        alerts:{
            cookies:'#ckdsclmrshtdwn_v2 > span',
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'#search > div > h3 > a',
            notFound: '#content > section.noproduct',
            login:'#user_login',
            employee: false,
            password:'#user_pass',
            price:'#search > div > div.product__prices > strong.price',
            submit: 'div.signin_buttons.col-md-10.col-12 > button',
            preLogin: false,
            search: '.menu_search__input',
            searchBtn: '.menu_search__submit'
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML, tax){
            const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')-1).replaceAll(',','.') * 1
            productPrice.netto = priceNetto
            productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax) 
            return productPrice
        }
    },
    PARTNERTELE:{
        urls:{
            login: 'https://hurtownia.partnertele.com/pl/user/login',
            logout:'https://hurtownia.partnertele.com/pl/user/logout'
        },
        access:{
            login:process.env.partnertele_login || '',
            password:process.env.partnertele_pass || ''
        },
        alerts:{
            cookies: false,
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'span.title',
            notFound: '#Shop > div > div > div.col-lg-12.col-md-12 > p',
            login:'#login',
            employee: false,
            password:'#password',
            price:'#price-count',
            submit: '#submitBtn',
            preLogin: false,
            search: '#search_query',
            searchBtn: '.search-form button[type="submit"]'
        },
        typeSearch: ['ean','sku','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceNetto = priceHTML * 1
            productPrice.netto = priceNetto
            productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            return productPrice
        }
    },
    EPSTRYK:{
        urls:{
            login: 'https://epstryk.pl/login.php',
            logout:'https://epstryk.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.epstryk_login || '',
            password:process.env.epstryk_pass || ''
        },
        alerts:{
            cookies:'#ckdsclmrshtdwn_v2 > span',
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'#search > div > div > h3 > a',
            notFound: '#menu_messages_warning',
            login:'#user_login',
            employee: false,
            password:'#user_pass',
            price:'#search > div > div > div.product_prices > span.price',
            submit: 'div.signin_buttons.col-md-10.col-xs-12 > button',
            preLogin: false,
            search: '.menu_search__input',
            searchBtn: '.menu_search__submit'
        },
        typeSearch: ['sku','ean','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('zł') - 1).replaceAll(',','.') * 1
            productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
            productPrice.brutto = priceBrutto
            return productPrice
        }
    },
    DMTRADE:{
        urls:{
            login: 'https://www.dmtrade.pl/logowanie.html',
            logout:'https://www.dmtrade.pl/lo.php?g=out'
        },
        access:{
            login:process.env.dmtrade_login || '',
            password:process.env.dmtrade_pass || ''
        },
        alerts:{
            cookies:'button.cc-nb-okagree',
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'.product-a h3 > a:nth-child(2)',
            notFound: '#content > div.dodatkowe > div > strong',
            login:'input[name=umail]',
            employee: false,
            password:'input[name=password]',
            price:'span.tax > span',
            submit:'input.button' ,
            preLogin: false,
            search: '#input-szukaj',
            searchBtn: '.input-absolute-box > button'
        },
        typeSearch: ['sku','ean','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceBrutto = priceHTML.replaceAll(',','.') * 1
            productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
            productPrice.brutto = priceBrutto
            return productPrice
        }
    },
    GADGETMASTER:{
        urls:{
            login: 'https://gadget-master.pl/signin.php',
            logout:'https://gadget-master.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.gadgetmaster_login || '',
            password:process.env.gadgetmaster_pass || ''
        },
        alerts:{
            cookies:'#ckdsclmrshtdwn_v2 > span',
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'.searchList__info > h3 > a > span',
            notFound: '#content > section.noproduct',
            login:'#user_login',
            employee: false,
            password:'#user_pass',
            price:'strong.price',
            submit: 'div.signin_buttons.col-md-10.col-12 > button',
            preLogin: false,
            search: '.menu_search__input',
            searchBtn: '.menu_search__submit'
        },
        typeSearch: ['sku','ean','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
            productPrice.netto = priceNetto
            productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            return productPrice
        }
    },
    TAYMA:{
        urls:{
            login: 'https://hurtownia.tayma.pl/signin.php',
            logout:'https://tayma.pl/login.php?operation=logout'
        },
        access:{
            login:process.env.tayma_login || '',
            password:process.env.tayma_pass || ''
        },
        alerts:{
            cookies:'#ckdsclmrshtdwn_v2 > span',
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'#search .product-name',
            notFound: '#menu_messages_warning',
            login:'#signin_login_input',
            employee: false,
            password:'#signin_pass_input',
            price:'#search > div > div > div.product_prices > span.price',
            submit: '#signin-form_box_sub_1 > form > button',
            preLogin: false,
            search: '#menu_search_text',
            searchBtn: '.icon-search'
        },
        typeSearch: ['ean','sku','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
            productPrice.netto = priceNetto
            productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            return productPrice
        }
    },
    B2BTRADE:{
        urls:{
            login: 'http://b2btrade.eu/',
            logout:'http://b2btrade.eu/Account/Logout'
        },
        access:{
            login:process.env.b2btrade_login || '',
            employee:process.env.b2btrade_employee || '',
            password:process.env.b2btrade_pass || ''
        },
        alerts:{
            cookies: false,
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'div h3 > a.green',
            notFound: '#main .items-not-found',
            login:'#Login',
            employee:'#UserName',
            password:'#Password',
            price:'div:nth-child(3) > span.green',
            submit: '#loginForm button[type="submit"]',
            preLogin: '#main > div.header-container.clearfix > div.header-menu-info-container > div.clearfix > button:nth-child(2)',
            search: '#searchPanelContainer input.search',
            searchBtn: '#searchPanelContainer i'
        },
        typeSearch: ['ean','sku','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            const priceNetto = priceHTML.slice(priceHTML.indexOf(' ') + 1).replaceAll(',','.') * 1
            productPrice.netto = priceNetto
            productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            return productPrice
        }
    },
    ACTION:{
        urls:{
            login: 'https://is3.action.pl/user/signin',
            logout:'https://is3.action.pl/user/signout'
        },
        access:{
            login:process.env.action_login || '',
            password:process.env.action_pass || ''
        },
        alerts:{
            cookies: false,
            extraCookies: '#unpaid-invoices-modal i',
            notifications: false
        },
        selectors:{
            name:'.description a.product-cart-trigger',
            notFound: '.empty-search',
            login:'#UserName',
            password:'#Password',
            price:'#default-list span.price-orig',
            submit: '#login-submit-button',
            preLogin: false,
            search: '#main-search-keyword',
            searchBtn: '.search-bar .fa-search'
        },
        typeSearch: ['ean','sku','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('PLN')).replaceAll(',','.') * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
        }
    },
    ABONLINE:{
        urls:{
            login: 'https://www.abonline.pl/',
            logout: false
        },
        access:{
            login:process.env.abonline_login || '',
            password:process.env.abonline_pass || ''
        },
        alerts:{
            cookies: false,
            extraCookies: false,
            notifications: false
        },
        selectors:{
            name:'.h1ProductName',
            notFound: '.divNoProducts',
            login:'#jsFrmLoginLogin',
            password:'#jsFrmLoginPass',
            price:'#productNettoPriceID .pricex',
            submit: '#jsBtnSiteLogin',
            preLogin: '#accept_cookie',
            search:'#inpSearchBoxPhrase',
            searchBtn: '#btnSearchBoxSearch',
            logout:'.btnTopLogout'
        },
        typeSearch: ['ean','sku','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
        }
    },
    BOSSOFTOYS:{
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
            name:'#login',
            login:'#login',
            password:'#password',
            price:'.responsive-details-value-inner',
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
        
        priceSave(products, htmlText, index){
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
    /*OMBERO:{
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
            name:'#topInfo0 > div:nth-child(3)',
            login:'#login',
            password:'#pass',
            price:'#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)')!=null)
                {
                    return document.querySelector('#content > div.listning-boxes.container-fluid > div > div > article > div.product-info.row > div:nth-child(3) > div.view_price_global > div.view_price > span:nth-child(1)').textContent;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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
    },*/
    VIVAB2B:{
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
            name:'#selly-cookies > div > a',
            login:'#llogin',
            password:'#lpassword',
            price:'body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong')!=null)
                {
                    return document.querySelector('body > div.container-max-default.clearfix > div > div.container-main > article > div > form > div > div > div.product-description > div > div.price > span:nth-child(3) > strong').textContent;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    FTOYS:{
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
            name:'#CookieAlertClose',
            login:'#Uzytkownik',
            password:'#Haslo',
            price:'#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto')!=null)
                {
                    return document.querySelector('#tabela-lista-produktow > tbody > tr > td.r.CenaPoRabacie.fit-content > div > div.brutto').textContent;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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
    
    TELFORCEONE:{
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
            name:'#menu_open > section.top-nav.luk > div > aside > nav > div > div > div > div.pasupr > div > a.ml20.login.logout-button',
            login:'#headerLoginUser',
            password:'#headerLoginPass',
            price:'#gridView > li > div.fr.mt22 > span'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('#gridView > li > div.fr.mt22 > span')!=null)
                {
                    return document.querySelector('#gridView > li > div.fr.mt22 > span').textContent;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    LAMEX:{
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
            name:'#cookies > div > a',
            login:'#signin_username',
            password:'#signin_password',
            price:'.price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.price')[1]!=null)
                {
                    return document.querySelectorAll('.price')[1].innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    LECHPOL:{
        urls:{
            login: 'https://www.lechpol.pl/pl/login',
            search:'https://www.lechpol.pl/pl/query/',
            logout:'https://www.lechpol.pl/pl/logout'
        },
        access:{
            login:process.env.lechpol_login || '',
            password:process.env.lechpol_pass || ''
        },
        alerts:{
            extraCookies:'div.modal-footer > button',
            notifications:'button.wpc_w_f_c_b.wpc_w_f_c_b-n'
        },
        buttons: {
            cookies:'',
            login:'#my-page > div > div > div.col-12.col-lg-6.offset-lg-1 > form > div.text-center.d-sm-flex.mb-5.align-items-center.justify-content-between > button',
        },
        selectors:{
            name:'',
            login:'#login_email',
            password:'#login_password',
            price:''
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
        
        priceSave(products, htmlText, index){
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
    
    AMIO:{
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
            name:'body > footer > div.message-popup-ui.cookie-notice-ui.box-ui.message-popup-lq.bottom-ui > i',
            login:'#main > div > div > div > div > div:nth-child(2) > input',
            password:'#main > div > div > div > div > div.login-password-container-ui > input',
            price:'.price-ui'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('.price-ui')[0]!=null)
                {
                    return document.querySelectorAll('.price-ui')[0].innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    FDDISTRIBUTION:{
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
            name:'#selly-cookies > div > a',
            login:'#llogin',
            password:'#lpassword',
            price:'.price-ui'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector('span.item.itemAdd > strong')!=null)
                {
                    return document.querySelector('span.item.itemAdd > strong').innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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
    
    APTEL:{
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
            name:'#cookies_info_close_pl',
            login:'#ctl00_MainContent_tbLogin',
            password:'#ctl00_MainContent_tbHaslo',
            price:''
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll("em")[11]!=null)
                {
                    return document.querySelectorAll("em")[11].innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    IKS2:{
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
            name:'',
            login:'#login_form > div > div:nth-child(1) > div > div.orderForm__field > input',
            password:'#login_form > div > div:nth-child(2) > div > div.orderForm__field > input',
            price:'span.productFull__quick_infoBox--price'
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('span.productFull__quick_infoBox--price')[0]!=null)
                {
                    return document.querySelectorAll('span.productFull__quick_infoBox--price')[0].innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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

    SONIA:{
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
            name:'',
            login:'#log_email',
            password:'#log_paswd',
            price:'document.querySelectorAll("td.col-cena.col-cena-bg-gazetka")[0]',
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
        
        priceSave(products, htmlText, index){
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

    SILIT:{
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
            name:'#cookie-policy-remove-button',
            login:'#email_id',
            password:'#password_id',
            price:'',
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
        
        priceSave(products, htmlText, index){
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
            name:'',
            login:'',
            password:'',
            price:'',
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
        
        priceSave(products, htmlText, index){
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
    
    ORNO:{
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
            name:'body > div.container > div > div > div > div > form > div.row > div > button',
            login:'#inputEmail',
            password:'#inputPassword',
            price:'div.product-show__price-value',
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
        
        priceSave(products, htmlText, index){
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


    /*EET:{
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
            name:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > button',
            login:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > div.mt-20 > div > label',
            password:'#modals-container > div > div.modal.modal-visible > div > div > div > article > div > form > div.mt-10 > div > label',
            price:'p.text-black.font-bold.text-14.uppercase',
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
        
        priceSave(products, htmlText, index){
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
    },*/

    /*K2:{
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
            name:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(2) > input',
            login:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(1) > input',
            password:'body > main > section.logins.mod-logins-1 > div > form > div:nth-child(3) > div:nth-child(2) > input',
            price:'',
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelectorAll('span.productFull__quick_infoBox--price')[0]!=null)
                {
                    return document.querySelectorAll('span.productFull__quick_infoBox--price')[0].innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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
    },*/

    /*HOMESCREEN:{
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
            name:'#submit-login',
            login:'#field-email',
            password:'#field-password',
            price:'document.querySelector("div.product-price-and-shipping > span").innerText',
        },
        
        async priceGet(page){
            return await page.evaluate(()=>{
                if(document.querySelector("div.product-price-and-shipping > span")!=null)
                {
                    return document.querySelector("div.product-price-and-shipping > span").innerText;
                } else return '';
            })
        },
        
        priceSave(products, htmlText, index){
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
    },*/
    nettoPrice(brutto,tax, place = 2) {
        return (brutto / (1 + tax / 100)).toFixed(place) * 1
    },
    bruttoPrice(netto,tax, place = 2) {
        return (netto * ( 1 + tax / 100)).toFixed(place) * 1
    }
}

module.exports=wholesalers;