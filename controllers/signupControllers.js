const signupModel = require("../models/signupModel");

let createUser = async (req, res) => {
  let error = [];
  if (req.body.password != req.body.repassword) {
      error.push("Mật khẩu không giống!");
  } else if (req.body.phoneNumber.length != 11 && req.body.phoneNumber.length != 10) {
      error.push("Vui lòng nhập số điện thoại có 10 hoặc 11 số");
  }

  // bao loi 
  if (error && error.length > 0) {
      console.log(error)
      req.flash("error", error);
      res.redirect("/signup");
  } else {
      let user = {
          account_address: req.body.account_address,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          password: req.body.password,
          kindOfUser: 'student',
          state: 0
      };

      // add user to database
      try {
          await signupModel.addUser(user);
          return res.redirect("/login");
      } catch (err) {
          req.flash("error", err);
          return res.redirect(req.get('referer'));
      }
  }
}

module.exports = {
  createUser: createUser,
}