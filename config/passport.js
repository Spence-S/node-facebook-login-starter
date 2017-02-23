const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');

// Pasport configuration for email and password
// options object changes usernameField to email
passport.use(new LocalStrategy({ usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email })
    .then((user) => {
      // if no user, alert that there is no user
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if an email match is found
      // compare the input password
      user.comparePassword(password, (err, isMatch) => {
        // if db password search and compare fails handle error
        if (err) { return done(err); }
        // if password matches, log in user with passport
        if (isMatch) { return done(null, user); }
        // if password doesn't match, don't log in user and alert
        // that password didn't match
        return done(null, false, { msg: 'Invalid email or password' });
      });
    })
    .catch(err => done(err));
  }));


// passport config for facebook, which can be used to sign up and sign in
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/users/auth/facebook/callback',
  profileFields: [
    'id',
    'displayName',
    'first_name',
    'last_name',
    'photos',
    'email',
    'friends',
    'relationship_status',
  ],
},
  (accessToken, refreshToken, profile, done) => {
    // get email from the information returned from facebook
    const email = profile.emails[0].value;
    // then check the database for the email(the only required field)
    User.findOne({ email })
      .then((user) => {
        // if there is no user in the database, then create one
        // based on the information returned from facebook
        if (!user) {
          // create new user
          const newUser = new User({
            email,
            facebook: profile,
            name: profile.displayName,
          });
          // save to db
          newUser.save();
          // return the new user on the req object
          return done(null, newUser);
        }
        // if there is already a user email in the db that matched the
        // facebook email that is returned, then return the found user on req.user
        return done(null, user);
      })
      .catch(err => done(err));
  }));


// serialize user to the session
passport.serializeUser((user, cb) => cb(null, user._id));

// deserilize user to req.user
passport.deserializeUser((id, cb) => {
  // console.log("id from deserialize User: \n",id)
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    return cb(null, user);
  });
});


module.exports = passport;
