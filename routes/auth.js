const Joi = require('joi')
const bcrypt = require('bcrypt')
const _= require('lodash')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {User} = require('../models/user')

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) return re.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!user || !validPassword) return res.status(400).send('Invalid email or passowrd')
  
  res.send(true)
})

const validate = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required()
  }
  return Joi.validate(req,schema)
}




module.exports = router