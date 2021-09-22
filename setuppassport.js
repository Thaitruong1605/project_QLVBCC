const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const loginController = require("./controllers/loginController");

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  passport.use(
    new LocalStrategy(
      async function (account_address, done) {
        try {
          await loginController
            .checkUser(account_address)
            .then(function (data) {
              return done(null, data);
            });
        } catch (err) {
          return done(null, false, { message: err });
        }
      }
    )
  );
};
