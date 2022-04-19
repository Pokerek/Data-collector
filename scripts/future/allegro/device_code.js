const axios = require('axios');
require('dotenv').config({path:'../../.env'})
const mongoose = require('../connect')

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

const device_code={

    async getDeviceCode()
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


    },

    codeReady(code)
    {
        return !!code
    },

    convertCode(code_object) {
        return {
            user_code: code_object.user_code,
            device_code: code_object.device_code,
            interval:code_object.interval,
            obtained: (new Date).getTime()/1000,
            expires_in: code_object.expires_in,
            date_of_expiration:(new Date).getTime()/1000+code_object.expires_in,
            verification_uri_complete:code_object.verification_uri_complete
        }
    },

    async createCode(data) {
        const device_code = new deviceCode(data)
        await device_code.save()
    },

    async getLatestObtainedDeviceCode()
    {
        let device_codes=await deviceCode.find(function (err, device_codes) {
            if (err) return false;
            else return device_codes
        }).clone().catch(function(err){return false})
        return device_codes[device_codes.length-1]
    },

    isDeviceCodeValid(code)
    {
        let now = (new Date).getTime()/1000
        if(code != false) return code.date_of_expiration>now
        else return false
    },
    
    async loadNewDeviceCode () {
        const data = await this.getDeviceCode()

        if(this.codeReady(data))
        {
            await createCode(convertCode(data))
        }
        else
        {
            console.log('Device code is not loaded correctly.');
            return false;
        }
    },
}

module.exports=device_code;