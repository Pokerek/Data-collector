const axios = require('axios')
const application_token=require('./application_token')
const user_token=require('./user_token')

const check_taxes={
    async getTaxSettingsForOffer(offerID)
    {
        const userToken = await user_token.getLastObtainedUserToken()

        if(user_token.isTokenValid(userToken))
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
            console.log('User token is not valid.');
            return false;
        }
        
    },

    async getTaxSettingsForCategory(categoryId)
    {
        const userToken = await user_token.getLastObtainedUserToken()

        if(user_token.isTokenValid(userToken))
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
            console.log('User token is not valid.');
            return false;
        }
        
    },

    async getPaymentsHistory()
    {
        const applicationToken = await application_token.getLastObtainedApplicationToken()

        if(application_token.isTokenValid(applicationToken))
        {
            try{
                    const load = await axios({
                        method: 'get',
                        url:`https://api.allegro.pl/payments/payment-operations`,
                        headers:{
                            'Authorization': 'Bearer ' + applicationToken.token,
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
            console.log('Application token is not valid.');
            return false;
        }
        
    },

    async getAllegroBillings()
    {
        const userToken = user_token.getLastObtainedUserToken()

        if(userToken && user_token.isTokenValid(userToken))
        {
            try{
                const load = await axios({
                    method: 'get',
                    url:`https://api.allegro.pl/billing/billing-entries`,
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
            console.log('User Token is not valid.');
            return false;
        }
    },

    async getAllegroBillingsTotalDailyOutcome(year, month, day)
    {
        const today_billings = await this.getAllegroBillings()
        let total_outcome=0

        if(today_billings)
        {
            for(let billing of today_billings)
            {
                total_outcome+=billing.balance.amount
            }

        }else
        {
            console.log('Billings are not loaded correctly!\n Profit is without taking into account Allegro commission and delivery costs.')
        }
        
        return total_outcome;
    },


}

module.exports=check_taxes
