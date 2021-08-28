const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user,done) =>{
    console.log('serializeUser called')
    done(null,user.id);
})

passport.deserializeUser((id,done) =>{
    User.findById(id).then((user) =>{
        console.log('deserializeUser called')
        done(null,user);
    })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "https://pure-sierra-36295.herokuapp.com/auth/google/callback",
      proxy:true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((user) => {
        if (user) {
          done(null, user);
        } else {
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);