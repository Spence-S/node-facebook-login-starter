const express = require('express');
const { User } = require('../models');
const { passport } = require('../config');
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

const router = express.Router();

const authenticate = passport.authenticate('local',
  {
    failureRedirect: '/users/login',
    successReturnToOrRedirect: '/',
    successRedirect: '/',
    failureFlash: true,
    successFlash: 'Welcome'
  });

// GET /users
router.get('/', (req, res) => {
  User.find({}).then((user) => {
    res.send(user);
  });
});

// GET /users/login
router.get('/login', ensureLoggedOut('/'), (req, res) => {
  res.render('login');
});

// POST /users/login
router.post('/login', authenticate, (req, res) => {
  res.send(req.user);
});


// GET /users/signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST /users/signup
// this will save the user to the database
router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;
  const newUser = new User({ email, password, name });
  newUser.save()
    .then((user) => {
      req.login(user, () => {
        res.redirect('/');
      });
    })
    .catch(err => next(err));
});

// GET /users/logout
router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.redirect('/users/login');
  } else {
    res.redirect('/');
  }
});

// FB routes
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
// users/auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email'],
}));
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

module.exports = router;
