const accountModel = require("../models/accountModel");
const validator = require('validator');
const moment = require('moment')
// get System contract 

let create = async (req, res) => {
  var error = [];
  var account = {
    account_address: req.body.account_address,
    account_type: req.body.account_type, 
    account_status: req.body.account_status, 
    student_id: (req.body.student_id)? req.body.student_id:null,
    issuer_id: (req.body.issuer_id)? req.body.issuer_id:null,
  };
  if (
    account.account_address == ""
    ){
    error.push("Vui lòng nhập địa chỉ tài khoản!");
  }

  if(error != "") {
    req.flash("error", error);
    res.redirect('back');
  }else{
    // add to database 
    try {
      await accountModel.create(account);
      res.redirect("/admin/account");
    }catch(err) {
      console.log(err);
      req.flash("error", err);
      res.redirect("/admin/account/create");
    }
  }
}
let update = async (req, res) => {
  var error = [];
  var account = {
    account_type: req.body.account_type, 
    account_status: req.body.account_status, 
    student_id: (req.body.student_id)? req.body.student_id:null,
    issuer_id: (req.body.student_id)? req.body.student_id:null,
  };
  if(error != "") {
    req.flash("error", error);
    res.redirect('back');
  }else{
    // add to database 
    try {
      await accountModel.update(req.body.account_address,account);
      res.redirect("/admin/account");
    }catch(err) {
      console.log(err);
      req.flash("error", err);
      res.redirect("/admin/account/create");
    }
  }
}


module.exports = {
  create,
  update,
};
