const axios = require('axios');
require('dotenv').config({path:'../../.env'})
const mongoose = require('../connect')

const clientID = process.env.CLIENT_ID||'';
const clientSecret = process.env.CLIENT_SECRET||'';
const basicAuth = Buffer.from(clientID+':'+clientSecret).toString('base64');

async function getApplicationToken()
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
        console.log(err.response.data);
        return false
    }


}

function tokenReady(token)
{
    return !!token
}

const applicationTokenSchema = new mongoose.Schema({
    token: String,
    token_type: String,
    obtained: Number,
    expires_in: Number,
    date_of_expiration: Number
})

const applicationToken = mongoose.model('application_token', applicationTokenSchema)

function convertToken(token_object) {
    return {
        token: token_object.access_token,
        token_type: token_object.token_type,
        obtained: (new Date).getTime()/1000,
        expires_in: token_object.expires_in,
        date_of_expiration:(new Date).getTime()/1000+token_object.expires_in
    }
}

async function createToken(data) {
    const application_token = new applicationToken(data)
    await application_token.save()
}

async function loadNewToken () {
    const data = await getApplicationToken()
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