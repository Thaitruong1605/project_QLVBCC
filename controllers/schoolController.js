const { detroy } = require("../dbconnect");
const schoolModel = require("../models/schoolModel");
const accountModel = require("../models/accountModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// get System contract 

let school_create = async (req, res) => {
  var error = [];
  var account = { 
    account_username: req.body.account_username,
    account_status: req.body.account_status,
    account_type: 'school'
  }
  if (account.account_username == '' || req.body.account_password == '' ){
    error.push("Vui lòng nhập thông tin đăng nhập!");
  }
  if (req.body.account_password != req.body.account_password ){
    error.push("Mật khẩu xác nhận không giống!");
    console.log(account.account_password);
  }else {
    // account.account_password = await bcrypt.hashSync(req.body.account_password, saltRounds);
  }
  var school = {
    school_code: req.body.school_code,
    school_name: req.body.school_name,
    school_placeAddress: req.body.school_placeAddress,
    school_phoneNumber: req.body.school_phoneNumber,
    school_website: req.body.school_website,
    school_fax: req.body.school_fax,
    school_email: req.body.school_email,
  };
  for (var attr in school) {
    if (typeof attr == "undefined") {
      error.push("Vui lòng nhập đầy đủ thông tin!");
      break;
    }
  }
  if (error == '') {
    try {
      await schoolModel.school_create(school).then(async function(){
        try {
          await schoolModel.school_getIdbyEmail(school.school_email).then(function(data){
            account.school_id = data.school_id;
          });
        }catch(err){
          console.log(err);
        }
        if (account.school_id != ''){
          try{
            await accountModel.create(account);
            req.flash("msg","Thêm mới trường thành công");
          }catch(err){
            console.log(err);
          }
        }
      })
    } catch (err) {
      console.log(err);
    }
  }else {
    req.flash("error", error);
  }
  return res.redirect("/admin/school/");
}

let school_checkUpdate = async (req, res) => {
  var error = [];
  var school = {
    school_code: req.body.school_code,
    school_name: req.body.school_name,
    school_placeAddress: req.body.school_placeAddress,
    school_phoneNumber: req.body.school_phoneNumber,
    school_website: req.body.school_website,
    school_fax: req.body.school_fax,
    school_email: req.body.school_email,
  };
  for (var attr in school) {
    if (typeof attr == "undefined") {
      error.push("Vui lòng nhập đầy đủ thông tin!");
      break;
    }
  }
  if (error == '') {
    try {
      if (typeof req.body.school_id == "undefined") await schoolModel.school_create(school);
      else await schoolModel.school_update(req.body.school_id, school);
      req.flash("Nhập nhật thông tin trường thành công!");
    } catch (err) {
      console.log(err);
      req.flash("error", err);
    }
  }else {
    req.flash("error", error);
  }
  return res.redirect("/admin/school");
};

module.exports = {
  school_create,
  school_checkUpdate
};
