const axios = require('axios');
require('dotenv').config({path:'../../.env'})
const mongoose = require('../connect')
const redirect_uri=process.env.REDIRECT_URI||'';
const clientID = process.env.CLIENT_ID||'';
const clientSecret = process.env.CLIENT_SECRET||'';
const basicAuth = Buffer.from(clientID+':'+clientSecret).toString('base64');

const deviceCodeSchema = new mongoose.Schema({
    user_code: String,
    device_code: String,
    interval: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number,
    verification_uri_complete: String
})

const deviceCode = mongoose.model('device_code', deviceCodeSchema)

async function getLatestObtainedDeviceCode()
{
    let device_codes=await deviceCode.find(function (err, device_codes) {
        if (err) return false;
        else return device_codes
    }).clone().catch(function(err){return false})
    return device_codes[device_codes.length-1]
}

function isDeviceCodeValid(code)
{
    let now = (new Date).getTime()/1000
    if(code != false) return code.date_of_expiration>now
    else return false
}

async function getUserToken()
{
    const deviceCode=await getLatestObtainedDeviceCode()
    if(deviceCode && isDeviceCodeValid(deviceCode))
    {
        try{
            const load = await axios({
                method: 'post',
                url:'https://allegro.pl/auth/oauth/token',
                headers:{
                    'Authorization':'Basic ' + basicAuth,
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                data: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code&device_code="+deviceCode.device_code
    
            });
    
            //console.log(load);
            const token = await load;
            return await token.data;
        }catch(err)
        {
            console.log(err.response.data);
            return false
        }
    }
    else{
        console.log('Device code is not valid!');
    }
}


async function getLastObtainedUserToken()
{
    let tokens=await userToken.find(function (err, tokens) {
        if (err) return 'error';
        else return tokens
    }).clone().catch(function(err){return err})
    return tokens[tokens.length-1]
}


async function refreshToken()
{
    const user_token = getLastObtainedUserToken();
    try{
        const load = await axios({
            method: 'post',
            url:'https://allegro.pl/auth/oauth/token',
            headers:{
                'Authorization':'Basic ' + basicAuth,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: `grant_type=refresh_token&refresh_token=${user_token.refresh_token}&redirect_uri=`+redirect_uri

        });

        //console.log(load);
        const token = await load;
        return await token.data;
    }catch(err)
    {
        console.log(err.response.data);
        return false
    }
}

function tokenReady(token)
{
    return !!token
}

const userTokenSchema = new mongoose.Schema({
    token: String,
    refresh_token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const userToken = mongoose.model('user_token', userTokenSchema)

function convertToken(token_object) {
    return {
        token: token_object.access_token,
        refresh_token:token_object.refresh_token,
        token_type: token_object.token_type,
        obtained: (new Date).getTime()/1000,
        expires_in: token_object.expires_in,
        date_of_expiration:(new Date).getTime()/1000+token_object.expires_in
    }
}

async function createToken(data) {
    const user_token = new userToken(data)
    await user_token.save()
}

async function loadNewToken () {
    const data = await getUserToken()
    const tokenready = tokenReady(data)
    if(tokenready)
    {
        createToken(convertToken(data))
    }
}

loadNewToken()
module.exports=loadNewToken;