const { detroy } = require("../dbconnect");
const studentModel = require("../models/studentModel");
const validator = require('validator');
const moment = require('moment')
// get System contract 

let create = async (req, res) => {
  var error = [];
  var student = {
    student_name: req.body.student_name,
    student_address: req.body.student_address,
    student_birth: req.body.student_birth, 
    student_phone: req.body.student_phone, 
    student_email: req.body.student_email
  };
  if (
    student.student_name == "" ||
    student.student_address == "" ||
    student.student_birth == "" ||
    student.student_phone == "" ||
    student.student_email == ""
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(student.student_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(student.student_phone)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");
  if(!validator.isDate(student.student_birth)) error.push("Vui lòng nhập đúng ngày!");

  if(error != "") {
    res.flash("error", error);
    res.redirect('back');
  }else{
    // add to database 
    try {
      await studentModel.insert(student);
      res.redirect("/admin/student");
    }catch(err) {
      console.log(err);
      res.flash("error", err);
      res.redirect("/admin/student/create");
    }
  }
}

let update = async (req, res) => {
  console.log(req.body.student_birth)
  var error = [];
  var student = {
    student_name: req.body.student_name,
    student_address: req.body.student_address,
    student_birth: moment(req.body.student_birth,'DD-MM-YYYY').format("YYYY-MM-DD"), 
    student_phone: req.body.student_phone, 
    student_email: req.body.student_email
  };
  if (
    student.student_name == "" ||
    student.student_address == "" ||
    student.student_birth == "" ||
    student.student_phone == "" ||
    student.student_email == ""
    ){
    error.push("Vui lòng nhập đầy đủ thông tin!");
  }
  if(!validator.isEmail(student.student_email)) error.push("Vui lòng nhập email đúng định dạng!");
  if(!validator.isMobilePhone(student.student_phone)) error.push("Vui lòng nhập số điện thoại đúng định dạng!");
  if(!validator.isDate(student.student_birth)) error.push("Vui lòng nhập đúng ngày!");

  if(error != "") {
    console.log(error);
    res.flash("error", error);
    res.redirect('back');
  }else{
    try {
      await studentModel.update(req.body.student_id, student);
      return res.redirect("/admin/student");
    } catch (err) {
      console.log(err);
      res.flash("error", err);
      return res.redirect("back");
    }
  }
};

module.exports = {
  create,
  update,
};
