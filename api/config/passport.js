const config = require('config');
const tokenHelper = require('../utils/tokenHelper');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const facebookID = config.get('facebookTESTAppID');
const facebookSecret = config.get('facebookTESTSecret');
const twitterKey = config.get('twitterAPIKey');
const twitterSecret = config.get('twitterAPISecret');

module.exports = function (passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookID,
        clientSecret: facebookSecret,
        callbackURL: '/api/passport-auth/auth/facebook/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        done(null, accessToken);
      }
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: twitterKey,
        consumerSecret: twitterSecret,
        callbackURL: '/api/passport-auth/auth/twitter/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        done(null, { token: accessToken, tokenSecret: refreshToken });
      }
    )
  );

  passport.serializeUser((profile, done) => {
    done(null, profile);
  });

  // deserialize the cookieUserId to user in the database
  passport.deserializeUser((profile, done) => {
    try {
      done(null, profile);
    } catch (err) {
      console.err(err);
      done(new Error('Failed to deserialize an user'));
    }
  });
};
