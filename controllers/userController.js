const { detroy } = require("../dbconnect");
const userModel = require("../models/userModel");
const validator = require("validator");
const moment = require("moment")
// get System contract 

let create = async (req, res) => {
  var error = [];
  var user = {
    user_name: req.body.user_name,
    user_placeAddress: req.body.user_placeAddress,
    user_gender: req.body.user_gender,
    user_birth: moment(req.body.user_birth, "DD/MM/YYYY").format('YYYY/MM/DD'),
    user_phoneNumber: req.body.user_phoneNumber,
    user_email: req.body.user_email,
    user_idNumber: req.body.user_idNumber
  };
  if (
    user.user_name == "" ||
    user.user_placeAddress == "" ||
    user.user_gender == "" ||
    user.user_birth == "" ||
    user.user_phoneNumber == "" ||
    user.user_idNumber == "" ||
    user.user_email == "" 
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(user.user_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(user.user_phoneNumber)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");

  if(error != "") {
    req.flash("error", error);
    res.redirect("back");
  }else{
    // add to database 
    try {
      await userModel.insert(user);
      res.redirect("/admin/user");
    }catch(err) {
      console.log(err);
      res.redirect("/admin/user/create");
    }
  }
}

let update = async (req, res) => {
  var error = [];
  var user = {
    user_name: req.body.user_name,
    user_placeAddress: req.body.user_placeAddress,
    user_gender: req.body.user_gender,
    user_birth: moment(req.body.user_birth, "DD/MM/YYYY").format('YYYY/MM/DD'),
    user_phoneNumber: req.body.user_phoneNumber,
    user_email: req.body.user_email,
    user_idNumber: req.body.user_idNumber
  };
  if (
    user.user_name == "" ||
    user.user_placeAddress == "" ||
    user.user_gender == "" ||
    user.user_birth == "" ||
    user.user_phoneNumber == "" ||
    user.user_idNumber == "" ||
    user.user_email == "" 
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(user.user_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(user.user_phoneNumber)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");
  if(!validator.isDate(user.user_birth)) error.push("Vui lòng nhập đúng ngày!");

  if(error != "") {
    console.log(error);
    res.redirect("back");
  }else{
    try {
      await userModel.update(req.body.user_id, user);
      req.flash("msg", "Cập nhật thông tin sinh viên thành công!");
      res.redirect("/admin/user");
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
  }
};

module.exports = {
  create,
  update,
};
