const mongoose = require('./connect')
const axios = require('axios')
require('dotenv').config({path:'../.env'})

const token = process.env.BL_TOKEN || ''

