const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const loginController = require("./controllers/loginController");

module.exports = function () {
  passport.serializeUser(function (email, done) {
    done(null, email);
  });
  passport.deserializeUser(function (email, done) {
    done(null, email);
  });
  passport.use(new LocalStrategy({
      usernameField: 'email',    // gan truong username bang email
      passwordField: 'password'
    },
    async function (username, password, done) {
      try{
        await loginController.checkUser(username, password).then(function(data){
          return done(null, data);
        });
      }catch(err){        
        return done(null, false, { message: err });
      }
    }
  ));
};