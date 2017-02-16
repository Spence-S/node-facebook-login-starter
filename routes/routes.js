var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


router.all('*',ensureLoggedIn('/users/login'));

/* GET home page. */
router.get('/',function(req, res, next) {
  console.log(req.session);
  res.render('index',
  {
    title: 'Express',
    name: req.user.username,
    email: req.user.email,
  });
});

router.get('/settings', (req, res, next) => {
  res.render('settings', req.user);
})

module.exports = router;
