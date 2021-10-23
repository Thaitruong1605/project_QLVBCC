const signupModel = require("../models/signupModel");
const validator = require("validator");
const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let createUser = async (req, res) => {
  let error = [];
  // bao loi 
  // add account 
  var account = {
    account_address: req.body.account_address,
    account_username: req.body.account_username,
    account_password: "",
    account_status:"active",
    account_type:"student"
  }
  //Kiểm tra username 
  if ( await signupModel.isExist_username(account.account_username)) error.push("Tên đăng nhập đã tồn tại!");
  else if ((account.account_username).length < 6 || (account.account_username).length > 12) error.push("Tên đăng nhập có từ 6 đến 12 ký tự!");
  else if (!validator.isAlphanumeric(account.account_username)) error.push("Tên đang nhập không được có ký tự đặc biệt!");
  else if (account.account_username.indexOf(" ") > 0 ) error.push("Tên đang nhập không được có khoản trắng!");
  //Kiểm tra password
  if (req.body.account_password != req.body.account_password2) error.push("Mật khẩu xác nhận không giống!");
  else {
    account.account_password= await bcrypt.hashSync(req.body.account_password, saltRounds);
    console.log(account.account_password)
  }
  var student={
    student_name: req.body.student_name,
    student_placeAddress: req.body.student_placeAddress,
    student_gender: req.body.student_gender,
    student_birth: moment(req.body.student_birth, "DD/MM/YYYY").format(),
    student_phoneNumber: req.body.student_phoneNumber,
    student_email: req.body.student_email,
    student_idNumber: req.body.student_idNumber
  }
  if (
    student.student_name == "" ||
    student.student_placeAddress == "" ||
    student.student_gender == "" ||
    student.student_birth == "" ||
    student.student_phoneNumber == "" ||
    student.student_idNumber == "" ||
    student.student_email == "" 
    ) error.push("Vui lòng nhập dầy đủ thông tin đăng ký!");

  if (await signupModel.isExist_email(student.student_email)) error.push("Email đã được đăng ký!");
  else if (!validator.isEmail(student.student_email)) error.push("Email không đúng định dạng");
  
  if (await signupModel.isExist_phoneNumber(student.student_phoneNumber)) error.push("Số điện thoại đã được đăng ký!");
  else if (!validator.isMobilePhone(student.student_phoneNumber , "vi-VN" )) error.push("Số điện thoại không đúng định dạng");
  
  if (await signupModel.isExist_idNumber(student.student_idNumber)) error.push("Số căn cước đã được đăng ký!");

  if (error && error.length > 0) {
      req.flash("error", error);
      res.redirect("/admin/student");
  } else {
      try {
        await signupModel.add_student(student, req.body.account_address);
      } catch (err) {
        console.log(err);
        return res.redirect("/admin/student");
      }
      try {
        await signupModel.get_student_id(student.student_email).then(async function(data){
          account.student_id = data; 
          try {
            await signupModel.add_account(account);
            req.flash("msg","Thêm tài khoản thành công!");
            res.redirect("/");
          }catch(err){
            console.log(err);
            return res.redirect("/admin/student");
          }
        })
      }catch(err){
        console.log(err);
        return res.redirect("/admin/student");
      }
  }
}

module.exports = {
  createUser,
}