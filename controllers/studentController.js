const { detroy } = require("../dbconnect");
const studentModel = require("../models/studentModel");
const validator = require("validator");
const moment = require("moment")
// get System contract 

let create = async (req, res) => {
  var error = [];
  var student = {
    student_name: req.body.student_name,
    student_placeAddress: req.body.student_placeAddress,
    student_gender: req.body.student_gender,
    student_birth: moment(req.body.student_birth, "DD/MM/YYYY").format('YYYY/MM/DD'),
    student_phoneNumber: req.body.student_phoneNumber,
    student_email: req.body.student_email,
    student_idNumber: req.body.student_idNumber
  };
  if (
    student.student_name == "" ||
    student.student_placeAddress == "" ||
    student.student_gender == "" ||
    student.student_birth == "" ||
    student.student_phoneNumber == "" ||
    student.student_idNumber == "" ||
    student.student_email == "" 
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(student.student_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(student.student_phoneNumber)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");

  if(error != "") {
    req.flash("error", error);
    res.redirect("back");
  }else{
    // add to database 
    try {
      await studentModel.insert(student);
      res.redirect("/admin/student");
    }catch(err) {
      console.log(err);
      res.redirect("/admin/student/create");
    }
  }
}

let update = async (req, res) => {
  var error = [];
  var student = {
    student_name: req.body.student_name,
    student_placeAddress: req.body.student_placeAddress,
    student_gender: req.body.student_gender,
    student_birth: moment(req.body.student_birth, "DD/MM/YYYY").format('YYYY/MM/DD'),
    student_phoneNumber: req.body.student_phoneNumber,
    student_email: req.body.student_email,
    student_idNumber: req.body.student_idNumber
  };
  if (
    student.student_name == "" ||
    student.student_placeAddress == "" ||
    student.student_gender == "" ||
    student.student_birth == "" ||
    student.student_phoneNumber == "" ||
    student.student_idNumber == "" ||
    student.student_email == "" 
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(student.student_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(student.student_phoneNumber)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");
  if(!validator.isDate(student.student_birth)) error.push("Vui lòng nhập đúng ngày!");

  if(error != "") {
    console.log(error);
    res.redirect("back");
  }else{
    try {
      await studentModel.update(req.body.student_id, student);
      req.flash("msg", "Cập nhật thông tin sinh viên thành công!");
      res.redirect("/admin/student");
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
