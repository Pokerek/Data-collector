var express = require('express');
var router = express.Router();
const test = require('../test')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(404).render('error', { message: 'Go out!' });
});

module.exports = router;
