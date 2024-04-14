const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const auth = () => {
  passport.serializeUser(function (req, user, cb) {
    const {
      base_url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content,
      temp_id,
      next
    } = JSON.parse(req.query.state);
    user.base_url = base_url;
    user.next = next;
    user.utm = {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
      utm_term,
      utm_content
    };
    user.temp_id = temp_id || null;
    cb(null, user);
  });

  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID || "default",
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
};

module.exports = auth;
