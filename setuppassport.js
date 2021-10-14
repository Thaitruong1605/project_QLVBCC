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
  
  passport.use(new LocalStrategy({
      usernameField: 'account_address',
      passwordField: 'account_address',
    },
    async function (username, password, done) {
      try{
        await loginController.checkAccount(username).then(function(data){
          console.log(data);
          return done(null, data);
        });
      }catch(err){        
        console.log(err);
        return done(null, false, { message: err });
      }
    }
  ));
};
