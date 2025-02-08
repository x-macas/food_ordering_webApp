const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://your-render-backend.onrender.com/auth/google/callback",
  proxy: true
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); // You can save the user to the database here
}));

// Serialize and deserialize user for session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
