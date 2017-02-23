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
//this will save the user to the database
router.post('/signup', (req, res, next) => {
  let { email, password, name } = req.body;
  let user = new User({email: email, password: password, name: name});
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

//FB routes
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     users/auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile','email', 'user_friends', 'user_relationships']
  }));
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

module.exports = router;
