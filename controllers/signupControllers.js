const signupModel = require("../models/signupModel");
const validator = require("validator");
const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs= require('fs');

let createUser = async (req, res) => {
  let error = [];
  // bao loi 
  // add account 
  var account = {
    account_address: req.body.account_address,
    account_username: req.body.account_username,
    account_password: "",
    account_status:"lock",
    account_type:"user"
  }
  console.log(account);
  //Kiểm tra username 
  if ( await signupModel.isExist_username(account.account_username)) error.push("Tên đăng nhập đã tồn tại!");
  else if ( typeof account.account_address == 'undefined') error.push("Vui lỏng kết nối với ví điện tử!");
  else if ((account.account_username).length < 4 || (account.account_username).length > 12) error.push("Tên đăng nhập có từ 4 đến 12 ký tự!");
  else if (!validator.isAlphanumeric(account.account_username)) error.push("Tên đang nhập không được có ký tự đặc biệt!");
  else if (account.account_username.indexOf(" ") > 0 ) error.push("Tên đang nhập không được có khoản trắng!");
  //Kiểm tra password
  if (req.body.account_password != req.body.account_password2) error.push("Mật khẩu xác nhận không giống!");
  else {
    account.account_password= await bcrypt.hashSync(req.body.account_password, saltRounds);
  }
  var user={
    user_name: req.body.user_name,
    user_placeAddress: req.body.user_placeAddress,
    user_gender: req.body.user_gender,
    user_birth: moment(req.body.user_birth, "DD/MM/YYYY").format(),
    user_phoneNumber: req.body.user_phoneNumber,
    user_email: req.body.user_email,
    user_idNumber: req.body.user_idNumber
  }
  console.log(user);
  if (
    user.user_name == "" ||
    user.user_placeAddress == "" ||
    user.user_gender == "" ||
    user.user_birth == "" ||
    user.user_phoneNumber == "" ||
    user.user_idNumber == "" ||
    user.user_email == "" 
    ) error.push("Vui lòng nhập dầy đủ thông tin đăng ký!");

  if (await signupModel.isExist_email(user.user_email)) error.push("Email đã được đăng ký!");
  else if (!validator.isEmail(user.user_email)) error.push("Email không đúng định dạng");
  
  if (await signupModel.isExist_phoneNumber(user.user_phoneNumber)) error.push("Số điện thoại đã được đăng ký!");
  else if (!validator.isMobilePhone(user.user_phoneNumber , "vi-VN" )) error.push("Số điện thoại không đúng định dạng");
  
  if (await signupModel.isExist_idNumber(user.user_idNumber)) error.push("Số căn cước đã được đăng ký!");

  if (error && error.length > 0) {
    req.flash("error", error);
    console.log(error)
    res.redirect("/signup");
  } else {
      try {
        await signupModel.add_user(user, req.body.account_address);
      } catch (err) {
        console.log(err);
        req.flash("error","Thêm thông tin người dùng thất bại!");
        return res.redirect("/signup");
      }
      try {
        await signupModel.get_user_id(user.user_email).then(async function(data){
          account.user_id = data; 
          try {
            await signupModel.add_account(account);
            req.flash("msg",`Tạo tài khoản ${account.account_username} thành công!`);
            res.redirect("/");
          }catch(err){
            console.log(err);
            req.flash("error","Thêm tài khoản thất bại!");
            return res.redirect("/signup");
          }
        })
      }catch(err){
        console.log(err);
        return res.redirect("/signup");
      }
  }
}

module.exports = {
  createUser,
}