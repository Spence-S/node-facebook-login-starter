const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const router = express.Router();

router.all('*', ensureLoggedIn('/users/login'));

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index',
    {
      title: 'Express',
      name: req.user.facebook.name.givenName,
      email: req.user.email,
      profile: req.user.facebook
    });
});

router.get('/settings', (req, res) => {
  const { user } = req;
  res.render('settings',
    user
  );
});

router.get('/managepw', (req, res) => {
  res.render('managepw', { user: req.user });
});

router.post('/managepw', (req, res) => {

});

module.exports = router;
