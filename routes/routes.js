var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


router.all('*',ensureLoggedIn('/users/login'));

/* GET home page. */
router.get('/',function(req, res, next) {
  console.log(req.user);
  res.render('index',
  {
    title: 'Express',
    name: req.user.facebook.name.givenName,
    email: req.user.email,
    profile: req.user.facebook,
  });
});

router.get('/settings', (req, res, next) => {
  res.render('settings',
    req.user
  );
})

router.get('/updatepw', (req, res, next) => {
  res.render('updatepw');
})

module.exports = router;
