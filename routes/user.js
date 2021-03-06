const bcrypt = require('bcrypt')
const _= require('lodash')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {User, validate} = require('../models/user')

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) return re.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  if (user) return res.status(400).send('User already exist.')

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  res.send(_.pick(user, ['name', 'email']));
})

module.exports = router