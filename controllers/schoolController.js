const { detroy } = require("../dbconnect");
const schoolModel = require("../models/schoolModel");


// get System contract 

let school_create = async (req, res) => {
  var error = [];
  var school = {
    school_code: req.body.school_code,
    school_name: req.body.school_name,
    school_placeAddress: req.body.school_placeAddress,
    school_phoneNumber: req.body.school_phoneNumber,
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
      await schoolModel.school_create(school);
      req.flash("msg","Thêm mới trường thành công");
    } catch (err) {
      console.log(err);
      req.flash("error", err);
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
