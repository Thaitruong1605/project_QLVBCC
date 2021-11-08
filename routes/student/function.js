const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const moment = require('moment');

const studentModel = require('../../models/studentModel');
const accountModel = require('../../models/accountModel');
router.get('/', (req, res)=> {
 
})
router.get('/thong-tin-ca-nhan',async(req, res)=>{
  var student, account ;
  try{
    await accountModel.get_accountById(req.user.student_id).then(function(data){
      return account  = data;
    })
  }catch(err){
    console.log(err);
  }
  try{
    await studentModel.select_byId(req.user.student_id).then(function(data){
      return student = data;
    })
  }catch(err){
    console.log(err);
  }
  res.render('./student/info',{title: 'Thông tin cá nhân',page:'student',student, account, moment});
})
router.post('/edit',async (req, res)=>{
  var student_info = req.body;
  if (typeof student_info.student_birth != 'undefined'){
    student_info.student_birth = moment(student_info.student_birth, 'DD/MM/YYYY').format()
  }
  try {
    await studentModel.update(req.user.student_id,student_info);
    req.flash('msg','Cập nhật thông tin cá nhân thành công!');
  }catch (err){
    console.log(err);
  }
  res.redirect('back');
})
module.exports = router;
