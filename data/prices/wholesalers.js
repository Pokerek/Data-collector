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
            before: '#ckdsclmrshtdwn_v2 > span',
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false
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
            before: false,
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: '#ckdsclmrshtdwn_v2 > span',
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: 'button.cc-nb-okagree',
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: '#ckdsclmrshtdwn_v2 > span',
            after: false
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
            preLogout: false,
            special: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false
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
            before: '#ckdsclmrshtdwn_v2 > span',
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: false,
            after: false
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: false,
            after: '#unpaid-invoices-modal i'
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
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
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
            before: false,
            after: false
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
            logout:'.btnTopLogout',
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: 1000,
            special: false
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
            logout:'https://b2b.bossoftoys.pl/index.php/logout'
        },
        access:{
            login:process.env.bossoftoys_login || '',
            password:process.env.bossoftoys_pass || ''
        },
        alerts:{
            before: false,
            after: 'a[title="cennik"]'
        },
        selectors:{
            name:'#grid table > tbody > tr:nth-child(1) > td:nth-child(3) > a',
            table: '#grid > div.table-wrapper > table > tbody',
            login:'#login',
            password:'#password',
            price:'#grid table > tbody > tr:nth-child(1) > td:nth-child(6)',
            submit: '.loginButton',
            preLogin: false,
            search:'#txtSearchString',
            preLogout: false
        },
        options: {
            table: true,
            lastChildName: true,
            searchWait: 1000,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('PLN')) * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
        }
    },
    VIVAB2B:{
        urls:{
            login: 'https://vivab2b.pl/konto.html?redirect=YTowOnt9',
            logout:'https://vivab2b.pl/?a=klient.logout'
        },
        access:{
            login:process.env.vivab2b_login || '',
            password:process.env.vivab2b_pass || ''
        },
        alerts:{
            before: '#selly-cookies > div > a',
            after: false
        },
        selectors:{
            name:'.product-description .description > h4 > a',
            notFound: '#not-found',
            login:'#llogin',
            password:'#lpassword',
            price:'.product-description .price strong',
            submit: '#login-box input[type="submit"]',
            preLogin: false,
            search:'#query',
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('zł')) * 1
                productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
                productPrice.brutto = priceBrutto
            }
            return productPrice
        }
    },

    FTOYS:{
        urls:{
            login: 'https://ftoys.pl/logowanie',
            logout:'https://ftoys.pl/logout'
        },
        access:{
            login:process.env.ftoys_login || '',
            password:process.env.ftoys_pass || ''
        },
        alerts:{
            before: false,
            after: false
        },
        selectors:{
            name:'#tabela-lista-produktow .produkt-nazwa',
            notFound: '.lista-produktow .alert-danger',
            login:'#Uzytkownik',
            password:'#Haslo',
            price:'#tabela-lista-produktow .CenaPoRabacie .netto',
            submit: '#login-form button[type="submit"]',
            preLogin: false,
            search:'.kontrolka-Wyszukiwarka input',
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('PLN')).replaceAll(',','.') * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
        }
    },
    
    TELFORCEONE:{
        urls:{
            login: 'https://sklep.telforceone.pl/',
            logout: false
        },
        access:{
            login:process.env.telforceone_login || '',
            password:process.env.telforceone_pass || ''
        },
        alerts:{
            before: '#ue_push_dialog > span',
            after: false
        },
        selectors:{
            name:'#gridView .title > h1 > a',
            notFound: '#list-product .box-info > .tfo-box-content',
            login:'#headerLoginUser',
            password:'#headerLoginPass',
            price:'#gridView .price',
            submit: '#loginButton',
            preLogin: '#menu_open .login.logout-button',
            search:'#search-input',
            preLogout: '#menu_open .zllog.mbut.bef',
            logout:'.llogin .logoutButton'
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: 1200,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('PLN')).replaceAll(',','.') * 1
                productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
                productPrice.brutto = priceBrutto
            }
            return productPrice
        }
    },

    LAMEX:{
        urls:{
            login: 'https://www.lamex.pl/login',
            logout: 'https://www.lamex.pl/logout'
        },
        access:{
            login:process.env.lamex_login || '',
            password:process.env.lamex_pass || ''
        },
        alerts:{
            before: '#cookies > div > a',
            after: false
        },
        selectors:{
            name:'.productGallery .title .title',
            notFound: 'div.komunikat',
            login:'#signin_username',
            password:'#signin_password',
            price:'#product-view .price',
            submit: '#register > fieldset > div:nth-child(5) > input',
            preLogin: false,
            search:'input.dark',
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')) * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
        }
    },

    LECHPOL:{
        urls:{
            login: 'https://www.lechpol.pl/pl/login',
            logout: 'https://www.lechpol.pl/pl/logout'
        },
        access:{
            login:process.env.lechpol_login || '',
            password:process.env.lechpol_pass || ''
        },
        alerts:{
            before: 'div.modal-footer > button',
            after: false
        },
        selectors:{
            name:'div.w-100.mb-2 > a > strong',
            notFound: 'div.alert.alert-info',
            login:'#login_email',
            password:'#login_password',
            price:'div.price-gross > span.price',
            submit: 'form > div.text-center.d-sm-flex.mb-5.align-items-center.justify-content-between > button',
            preLogin: false,
            search:'#searchbox_query',
            preLogout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
                productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
                productPrice.brutto = priceBrutto
            }
            return productPrice
        }
    },
    
    AMIO:{
        urls:{
            login: 'https://amio.pl/logowanie/7',
            logout: false
        },
        access:{
            login:process.env.amio_login || '',
            password:process.env.amio_pass || ''
        },
        alerts:{
            before: 'body > footer > div.message-popup-ui.cookie-notice-ui.box-ui.message-popup-lq.bottom-ui > i',
            after: false
        },
        selectors:{
            name:'div.name-and-code-ui > h3',
            notFound: 'p.message-bar-ui',
            login:'input[name=email]',
            password:'input[name=password]',
            price:'div.final-price-column-ui > p',
            submit: 'button.sign-in-lq.enter-key-trigger-lq.button-ui.login-button-ui',
            preLogin: false,
            search:'input.search-ui',
            preLogout: false,
            logout:'button.va-unset-ui.btn-pure-ui.sign-out-lq.header-item-label-ui'
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('PLN')).replaceAll(',','.') * 1
                productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
                productPrice.brutto = priceBrutto
            }
            return productPrice
        }
    },

    FDDISTRIBUTION:{
        urls:{
            login: 'https://fd-distribution.pl/konto.html?redirect=YTowOnt9',
            logout: 'https://fd-distribution.pl/?a=klient.logout'
        },
        access:{
            login:process.env.fddistribution_login || '',
            password:process.env.fddistribution_pass || ''
        },
        alerts:{
            before: '#selly-cookies > div > a',
            after: false
        },
        selectors:{
            name: 'div.description > h4 > a',
            notFound: '#not-found',
            login: '#llogin',
            password: '#lpassword',
            price: 'div.price > span.item.itemAdd > strong',
            submit: 'input.btn.color1',
            preLogin: false,
            search: '#query',
            preLogout: false,
            logout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],

        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceBrutto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
                productPrice.netto = wholesalers.nettoPrice(priceBrutto,tax)
                productPrice.brutto = priceBrutto
            }
            return productPrice
        }
    },
    
    APTEL:{
        urls:{
            login: 'http://aptel.pl/Default.B2B.aspx',
            logout: false
        },
        access:{
            login:process.env.aptel_login || '',
            password:process.env.aptel_pass || ''
        },
        alerts:{
            before: false,
            after: false,
        },
        selectors:{
            name:'#srodkowoPrawaKolumna h2 > em > a',
            table: '#srodkowoPrawaKolumna > div.TableWrapper > div > table > tbody',
            login:'#ctl00_MainContent_tbLogin',
            password:'#ctl00_MainContent_tbHaslo',
            price:'.ceny > p > em',
            submit: '#ctl00_MainContent_btZaloguj_Button',
            preLogin: false,
            search:'#ctl00_miWyszukiwanieProduktow',
            preLogout: false,
            logout:'#belkaGornaNL_wyloguj'
        },
        options: {
            table: true,
            lastChildName: false,
            searchWait: 1000,
            special: 'APTEL'
        },
        special: {
            search:'http://aptel.pl/ProduktyWyszukiwanie.aspx?search='
        },
        typeSearch: ['sku','name'],
    
        async getStoragePrice(productPrice, priceHTML,tax){
          if(priceHTML) {
              const priceNetto = priceHTML.slice(0,priceHTML.indexOf('PLN')).replaceAll(',','.') * 1
              productPrice.netto = priceNetto
              productPrice.brutto = wholesalers.nettoPrice(priceNetto,tax)
          }
          return productPrice
        },
    },

    IKS2:{
        urls:{
            login: 'https://iks2.pl/pl/order/login.html',
            logout: 'https://iks2.pl/pl/order/logout.html'
        },
        access:{
            login:process.env.iks2_login || '',
            password:process.env.iks2_pass || ''
        },
        alerts:{
            before: false,
            after: false
        },
        selectors:{
            name:'div.productFull__name.v_center > a',
            noFound: 'div.-column--right > div.message',
            login:'input.orderForm__textfield[name=login]',
            password:'input.orderForm__textfield[name=password]',
            price:'.productFull__quick_info > div:nth-child(4) > .productFull--price > span',
            submit: 'label.btn.btn--noArrow.orderForm__submit',
            preLogin: false,
            search:'input.searchTop__textfield.grow',
            preLogout: false,
            logout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['ean','sku','name'],
    
        async getStoragePrice(productPrice, priceHTML,tax){
          if(priceHTML) {
              const priceNetto = priceHTML.slice(0,priceHTML.indexOf('ZŁ')).replaceAll(',','.') * 1
              productPrice.netto = priceNetto
              productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
          }
          return productPrice
        },
      },

      SONIA:{
        urls:{
            login: 'https://b2b.sonia.pl/',
            logout: 'https://b2b.sonia.pl/wyloguj.html'
        },
        access:{
            login:process.env.sonia_login || '',
            password:process.env.sonia_pass || ''
        },
        alerts:{
            before: false,
            after: false
        },
        selectors:{
            name:'.col-nazwa.tw-nazwa > a',
            noFound: '.brak_msg',
            login:'#log_email',
            password:'#log_paswd',
            price:'.col-cena',
            submit: 'input.btn',
            preLogin: false,
            search:'input.zakres-nazwa-text',
            preLogout: false,
            logout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['ean','sku','name'],
    
        async getStoragePrice(productPrice, priceHTML,tax){
          if(priceHTML) {
              const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
              productPrice.netto = priceNetto
              productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
          }
          return productPrice
        },
    },

    SILIT:{
        urls:{
            login: 'https://silit.abstore.pl/client/loginorcreate/login/',
            logout: 'https://silit.abstore.pl/client/logout/'
        },
        access:{
            login:process.env.silit_login || '',
            password:process.env.silit_pass || ''
        },
        alerts:{
            before: '#cookie-policy-remove-button',
            after: false
        },
        selectors:{
            name:'#offerTable .product-list-item a > h3',
            noFound: '#controllerContent div > h3',
            login:'#email_id',
            password:'#password_id',
            price:'#offerTable .product-list-item .abs-item-price > span',
            submit: '#login_id',
            preLogin: false,
            search:'#searchInput_cartPreview',
            preLogout: false,
            logout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku', 'name'],
    
        async getStoragePrice(productPrice, priceHTML,tax){
          if(priceHTML) {
              const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
              productPrice.netto = priceNetto
              productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
          }
          return productPrice
        },
      },
    
      ORNO:{
        urls:{
            login: 'https://b2b.orno.pl/',
            logout: 'https://b2b.orno.pl/logout'
        },
        access:{
            login:process.env.orno_login || '',
            password:process.env.orno_pass || ''
        },
        alerts:{
            before: false,
            after: false
        },
        selectors:{
            name:'.box-body td:nth-child(2) > a',
            noFound: '.box-success tr > td[colspan="6"]',
            login:'#inputEmail',
            password:'#inputPassword',
            price:'div.product-show__price-value',//po wejściu do strony produktu
            submit: 'button.btn.btn-lg.btn-primary.btn-block',
            preLogin: false,
            search:'#main-searchbar',
            preLogout: false,
            logout: false
        },
        options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: "ORNO"
        },
        typeSearch: ['sku','ean','name'],
    
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')) * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
          },
    },
    
    TOPEX:{
        urls:{
            login: 'https://strefagtx.pl/',
            logout:'https://strefagtx.pl/customer/account/logout'
        },
        access:{
            login:process.env.topex_login || '',
            password:process.env.topex_pass || ''
        },
        alerts: {
            before:'#accept-cookies-checkbox',
            after:'',
        },
        selectors:{
            name:'h2.product-name.uppercase.large-12.columns > a', 
            noFound: '#search-results-tab-1 > div.search-results-products.search-results-left > div', 
            login:'#email',
            password:'#pass',
            price:'p.price > span',
            submit: '#send2',
            preLogin: false,
            search:'#search',
            preLogout: false,
            logout: false
        },
       options: {
            table: false,
            lastChildName: false,
            searchWait: false,
            special: false
        },
        typeSearch: ['sku','ean','name'],
        
        async getStoragePrice(productPrice, priceHTML,tax){
            if(priceHTML) {
                const priceNetto = priceHTML.slice(0,priceHTML.indexOf('zł')).replaceAll(',','.') * 1
                productPrice.netto = priceNetto
                productPrice.brutto = wholesalers.bruttoPrice(priceNetto,tax)
            }
            return productPrice
          },
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