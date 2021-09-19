const { detroy } = require("../dbconnect");
const issuerModel = require("../models/issuerModel");

let issuer_checkUpdate = async (req, res) => {
  var error = [];
  console.log(req.body.issuer_id);
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
