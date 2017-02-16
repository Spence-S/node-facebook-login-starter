var express = require('express');
var router = express.Router();
var { User } = require('../models');
var { passport } = require('../config');

var authenticate = passport.authenticate('local',
  {
    failureRedirect: '/users/signup',
    successReturnToOrRedirect: '/'
  });

//GET /users
router.get('/', function(req, res, next) {
  User.find({})
    .then( user => {
      res.send(user);
    })
});

//GET /users/login
router.get('/login', (req, res, next) => {
  res.render('login');
});


//POST /users/login
router.post('/login', authenticate, (req, res, next) => {
  res.send(req.user);
});


//GET /users/signup
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

//POST /users/signup
router.post('/signup', (req, res, next) => {
  let { email, password } = req.body;
  let user = new User({email: email, password: password});
  user.save()
    .then( user => {
      req.login(user, () => {
        res.redirect('/');
      });
    })
    .catch( err => {
      return next(err);
    });
});

//GET /users/logout
router.get('/logout', (req, res, next) => {
  if(req.user){
    req.logout();
    res.redirect('/users/login');
  }
  else{
    res.redirect('/');
  }
});

module.exports = router;
