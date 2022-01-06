const axios = require('axios');
const mongoose = require('../connect')
const redirect_uri = process.env.REDIRECT_URI||'';
const clientID = process.env.CLIENT_ID||'';
const clientSecret = process.env.CLIENT_SECRET||'';
const basicAuth = Buffer.from(clientID+':'+clientSecret).toString('base64');
const device_code = require('./device_code')
require('dotenv').config({path:'../../.env'})

const user_token={
    userTokenSchema : new mongoose.Schema({
        token: String,
        refresh_token: String,
        token_type: String,
        obtained: Number,
        expires_in: Number,
        date_of_expiration: Number
    }),
    
    userToken : mongoose.model('user_token', userTokenSchema),

    async getUserToken()
    {
        const deviceCode=await device_code.getLatestObtainedDeviceCode()
        if(deviceCode && device_code.isDeviceCodeValid(deviceCode))
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
    },
    
    
    async refreshToken()
    {
        const user_token = await this.getLastObtainedUserToken();
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
    },
    
    tokenReady(token)
    {
        return !!token
    },
    
    convertToken(token_object) {
        return {
            token: token_object.access_token,
            refresh_token:token_object.refresh_token,
            token_type: token_object.token_type,
            obtained: (new Date).getTime()/1000,
            expires_in: token_object.expires_in,
            date_of_expiration:(new Date).getTime()/1000+token_object.expires_in
        }
    },
    
    async createToken(data) {
        const user_token = new this.userToken(data)
        await user_token.save()
    },

    async getLastObtainedUserToken()
    {
        let tokens=await this.userToken.find(function (err, tokens) {
            if (err) return 'error';
            else return tokens
        }).clone().catch(function(err){return err})
        return tokens[tokens.length-1]
    },

    isTokenValid(token)
    {
        let now = (new Date).getTime()/1000
        if(token != 'error') return token.date_of_expiration>now
        else return false
    },
    
    async loadNewToken () {
        const data = await this.getUserToken()

        if(this.tokenReady(data))
        {
            await this.createToken(convertToken(data))
        }
        else
        {
            console.log('User token is not loaded correctly.');
            return false;
        }
    },

}

module.exports=user_token;