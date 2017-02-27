const express = require('express');
const { User } = require('../models');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const router = express.Router();

//
// Remove password middle ware
//
const removePassword = (req, res, next) => {
  // check and see if a password has been set
  if (req.user.password) {
    // if password was alredy set
    // remove password so it doesn't get sent to front end
    req.user.password = 'Sorry ;)';
    return next();
  }
  return next();
};

//
// ensure logged in middle ware
//
router.all('*', ensureLoggedIn('/users/login'));

//
// Flash messaging route for testing
//
router.get('/setflash', (req, res) => {
  req.flash('error', 'generic errors abound');
  res.redirect('/');
});


/* GET home page. */
router.get('/', (req, res) => {
  res.render('index',
    {
      title: 'Express',
      name: req.user.name,
      email: req.user.email,
      profile: req.user.facebook
    });
});

router.get('/settings', removePassword, (req, res) => {
  res.render('settings',
    req.user
  );
});

router.get('/managepw', (req, res) => {
  res.render('managepw', { user: req.user });
});

router.post('/managepw', (req, res, next) => {
  // Find the user
  User.findById(req.user.id)
    .then((user) => {
      if (req.body.currentPassword !== user.password) {
        // Somehow show an error
        req.flash('error', 'The current password you typed was incorrect');
        // Todo -- setup flash error message modals
      }
      // update the found user via save()
      user.password = req.body.password;
      user.save()
        .then(() => {
          // redirect back to settings
          res.redirect('/settings');
        })
        // cant rememeber if you need a .catch here, putting here for safety
        // (todo -- evaluate .catch)
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
