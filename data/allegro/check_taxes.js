const mongoose = require('../connect')

const tokenSchema = new mongoose.Schema({
    token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const Token = mongoose.model('Token', tokenSchema)

async function getLastObtainedToken()
{
    let tokens=await Token.find(function (err, tokens) {
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

async function getTaxSettings(userToken, categoryId)
{
    try{
        const load = await axios({
            method: 'get',
            url:'https://api.allegro.pl/sale/tax-settings',
            params:{
                'category.id':categoryId,
            },
            headers:{
                'Authorization': 'Bearer ' + userToken,
                'Accept': 'application/vnd.allegro.public.v1+json'
            }
        });

        return await load.data.settings;
    }catch(err)
    {
        console.log(err.response);
    }
}

(async() => {
    let check=await getLastObtainedToken()
    console.log(check)
    console.log(isTokenValid(check))
})();

module.exports=getTaxSettings
