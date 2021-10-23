const accountModel = require("../models/accountModel");
const validator = require('validator');
const moment = require('moment')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// get System contract 

let update = async (req, res) => {
  var error = [];
  var account_info = {
    account_status: req.body.account_status,
  };

  if ( req.body.password != req.body.password2){
    error.push("Vui lòng xác nhận đúng mật khẩu!");
  }else if (req.body.password != ''){
    account_info.account_password = await bcrypt.hashSync(req.body.password, saltRounds )
  }
  if(error != "") {
    req.flash("error", error);
    res.redirect('/admin/account');
  }else{
    try {
      await accountModel.update(req.body.account_username,account_info);
      req.flash("msg","Cập nhật tài khoản thành công!");
      res.redirect("/admin/account");
    }catch(err) {
      console.log(err);
      res.redirect("/admin/account");
    }
  }
}
module.exports = {
  update
};
