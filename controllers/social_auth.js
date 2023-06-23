const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "907240950221-5vst8ieqmt8hj1uckovfp16s0cfs96fe.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/v1/api",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      // Here, you can create or update a user in your database
      // using the user profile data received from Google
      console.log("Profile:", profile);
      callback(null, profile);
    }
  )
);

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
