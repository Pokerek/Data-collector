const mongoose = require('../connect')
const axios = require('axios')


//application_token

const applicationTokenSchema = new mongoose.Schema({
    token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const applicationToken = mongoose.model('application_token', applicationTokenSchema)

async function getLastObtainedApplicationToken()
{
    let tokens=await applicationToken.find(function (err, tokens) {
        if (err) return 'error';
        else return tokens
    }).clone().catch(function(err){return err})
    return tokens[tokens.length-1]
}



//userToken
const userTokenSchema = new mongoose.Schema({
    token: String,
    refresh_token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const userToken = mongoose.model('user_token', userTokenSchema)

async function getLastObtainedUserToken()
{
    let tokens=await userToken.find(function (err, tokens) {
        if (err) return 'error';
        else return tokens
    }).clone().catch(function(err){return err})
    return tokens[tokens.length-1]
}

function isTokenValid(token)
{
    let now = (new Date).getTime()/1000
    if(token != 'error') return token.date_of_expiration>now
    else return false
}

async function getTaxSettings(offerID)
{
    const userToken = await getLastObtainedUserToken()

    if(isTokenValid(userToken))
    {
        try{
                const load = await axios({
                    method: 'get',
                    url:`https://api.allegro.pl/sale/offers/${offerID}`,
                    headers:{
                        'Authorization': 'Bearer ' + userToken.token,
                        'Accept': 'application/vnd.allegro.public.v1+json'
                    }
                });

                return load.data;
            }catch(err)
            {
                console.log(err.response.data);
                return false;
            }
    }else{
        console.log('Token is not valid.');
        return false;
    }
    
}

async function getTaxSettingsForCategory(categoryId)
{
    const userToken = await getLastObtainedUserToken()

    if(isTokenValid(userToken))
    {
        try{
                const load = await axios({
                    method: 'get',
                    url:`https://api.allegro.pl/sale/tax-settings`,
                    params:{
                        'category.id':categoryId
                    },
                    headers:{
                        'Authorization': 'Bearer ' + userToken.token,
                        'Accept': 'application/vnd.allegro.public.v1+json'
                    }
                });

                return load.data;
            }catch(err)
            {
                console.log(err.response.data);
                return false;
            }
    }else{
        console.log('Token is not valid.');
        return false;
    }
    
}

async function getPaymentsHistory()
{
    const userToken = await getLastObtainedApplicationToken()

    if(isTokenValid(userToken))
    {
        try{
                const load = await axios({
                    method: 'get',
                    url:`https://api.allegro.pl/payments/payment-operations`,
                    headers:{
                        'Authorization': 'Bearer ' + userToken.token,
                        'Accept': 'application/vnd.allegro.public.v1+json'
                    }
                });

                return load.data;
            }catch(err)
            {
                console.log(err.response.data);
                return false;
            }
    }else{
        console.log('Token is not valid.');
        return false;
    }
    
}


(async() => {
    //let check=await getLastObtainedToken()
    //console.log(check)
    //console.log(isTokenValid(check))
    //console.log(await getTaxSettings(11598909174))67303
    console.log(await getTaxSettingsForCategory(67303))
    //console.log(await getPaymentsHistory())
})();

module.exports=getTaxSettings
