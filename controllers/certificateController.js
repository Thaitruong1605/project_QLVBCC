const certificateModel = require('../models/certificateModel');

let create = async(req, res) => {
  var error = [];
  var certificate = {
    number: req.body.number, 
    issuer_id: req.body.issuer_id, 
    student_id: req.body.student_id, 
  }
  if (certificate.number == '' ){
    error.push("Vui lòng nhập số chứng chỉ");
  }
  if (error != ''){
    req.flash("error", error);
    res.redirect('back');
  }else {
    try{
      await certificateModel.create(certificate).then(function(){
        req.flash('msg', "Thêm mới chứng chỉ thành công!");
        res.redirect('/issuer/certificate');
      })
    }catch(err){
      req.flash('error', err);
      res.redirect('back');
    }
  }
}

let edit = async(req, res) => {

}

module.exports = {
  create,
  edit
}