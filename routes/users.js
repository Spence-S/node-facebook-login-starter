var express = require('express');
var router = express.Router();
var { User } = require('../models');
var { passport } = require('../config');

var authenticate = passport.authenticate('local');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then( user => {
      res.send(user);
    })
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', authenticate, (req, res, next) => {
  res.send(req.user);
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
