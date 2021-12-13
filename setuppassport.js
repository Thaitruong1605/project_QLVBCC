const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const loginModel = require("./models/loginModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.use(new LocalStrategy( async function (username, password, done) {
    try{
      var account = await loginModel.findAccount(username);
      // password= await bcrypt.hashSync(password, saltRounds);
      if (await bcrypt.compareSync(password, account.account_password)){
        if (account.account_status == "lock"){
          return done(null, false, { message: "Tài khoản đã bị khoá!" });
        }
        return done(null, account);
      }
      return done(null, false, { message: "Sai mật khẩu!" });
    }catch(err){        
      console.log(err);
      return done(null, false, { message: "Sai tên đăng nhập!" });
    }
  }));
};
