const { detroy } = require("../dbconnect");
const studentModel = require("../models/studentModel");
const validator = require('validator');
// get System contract 

let add_studentinfo = async (req, res) => {
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
    res.flash(error);
    res.redirect('back');
  }else{
    // add to database 
    
  }
}

let issuer_checkUpdate = async (req, res) => {
  var error = [];
  var issuer = {
    issuer_code: req.body.issuer_code,
    issuer_name: req.body.issuer_name,
    issuer_address: req.body.issuer_address,
    issuer_phone: req.body.issuer_phone,
    issuer_fax: req.body.issuer_fax,
    issuer_email: req.body.issuer_email,
  };
  for (var attr in issuer) {
    if (typeof attr == "undefined") {
      error.push("Vui lòng nhập đầy đủ thông tin!");
      break;
    }
  }
  if (error == '') {
    try {
      if (typeof req.body.issuer_id == "undefined") await issuerModel.issuer_create(issuer);
      else await issuerModel.issuer_update(req.body.issuer_id, issuer);

      return res.redirect("/admin/issuer");
    } catch (err) {
      console.log(err);
      res.flash("error", err);
      return res.redirect("/admin/issuer/create");
    }
  }else {
    res.flash("error", error);
  }
};

module.exports = {
  issuer_checkUpdate,
};
