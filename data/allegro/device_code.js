const axios = require('axios');
require('dotenv').config({path:'../../.env'})
const mongoose = require('../connect')

const clientID = process.env.CLIENT_ID||'';
const clientSecret = process.env.CLIENT_SECRET||'';
const basicAuth = Buffer.from(clientID+':'+clientSecret).toString('base64');

async function getDeviceCode()
{
    try{
        const load = await axios({
            method: 'post',
            url:'https://allegro.pl/auth/oauth/device',
            headers:{
                'Authorization':'Basic ' + basicAuth,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: `client_id=${clientID}`

        });

        //console.log(load);
        const code = await load;
        return await code.data;

    }catch(err)
    {
        console.log(err.response.data);
        return false;
    }


}

function codeReady(code)
{
    return !!code
}

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

function convertCode(code_object) {
    return {
        user_code: code_object.user_code,
        device_code: code_object.device_code,
        interval:code_object.interval,
        obtained: (new Date).getTime()/1000,
        expires_in: code_object.expires_in,
        date_of_expiration:(new Date).getTime()/1000+code_object.expires_in,
        verification_uri_complete:code_object.verification_uri_complete
    }
}

async function createCode(data) {
    const device_code = new deviceCode(data)
    await device_code.save()
}

async function loadNewDeviceCode () {
    const data = await getDeviceCode()
    const tokenready = codeReady(data)
    if(tokenready)
    {
        createCode(convertCode(data))
    }
}

loadNewDeviceCode()
module.exports=loadNewDeviceCode;