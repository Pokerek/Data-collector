const axios = require('axios');
require('dotenv').config({path:'../../.env'})
const mongoose = require('../connect')

const clientID = process.env.CLIENT_ID||'';
const clientSecret = process.env.CLIENT_SECRET||'';
const basicAuth = Buffer.from(clientID+':'+clientSecret).toString('base64');

async function getUserToken()
{
    try{
        const load = await axios({
            method: 'post',
            url:'https://allegro.pl/auth/oauth/token',
            headers:{
                'Authorization':'Basic ' + basicAuth,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: "grant_type=client_credentials"

        });

        return await load.data;
    }catch(err)
    {
        return 'error'
    }


}

function tokenReady(token)
{
    return token!='error'
}

const tokenSchema = new mongoose.Schema({
    token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

function convertToken(token_object) {
    return {
        token: token_object.access_token,
        token_type: token_object.token_type,
        obtained: (new Date).getTime()/1000,
        expires_in: token_object.expires_in,
        date_of_expiration:(new Date).getTime()/1000+token_object.expires_in
    }
}

const Token = mongoose.model('Token', tokenSchema)

async function createToken(data) {
    const token = new Token(data)
    await token.save()
}

async function loadNewToken () {
    const data = await getUserToken()
    const tokenready = tokenReady(data)
    if(tokenready)
    {
        createToken(convertToken(data))
    }
    else
    {
        createToken(convertToken(data))
    }
}

loadNewToken()
module.exports=loadNewToken;