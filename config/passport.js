const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

let localOptions = {
  usernameField: "email"
}

passport.use(new LocalStrategy(localOptions,
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      user.comparePassword(password, (err, isMatch) => {
        console.log(password);
        console.log(isMatch);
        if(err){return done(err);}
        if(isMatch){
          return done(null, user);
        }
        return done(null, false, {msg: 'Invalid email or password'})
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  console.log("user from serializeUser" ,user);
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  console.log("id from deserialize User:",id)
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


module.exports = passport;
