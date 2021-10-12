const express = require("express");
const router = express.Router();
const moment = require('moment');
const accountModel = require("../../../models/accountModel");
const accountController = require("../../../controllers/accountController");
const issuerModel =require("../../../models/issuerModel");
const studentModel =require("../../../models/studentModel");
router.get('/', (req, res) => {
  // Lay du lieu account
  try{
    accountModel.select().then(function(data){
      return res.render('./admin/functions/account/',{title:"Account", account_list:data, moment, page:"Danh sách"});
    })
  }catch(err){
    console.log(err);
    req.flash("error",err);
    return res.redirect("/admin");
  }
})
router.get('/detail-student', (req, res) => {
  if (typeof req.query.id !== 'undefined'){
    try {
      accountModel.get_studentInfo(req.query.id).then(function(data){
        res.render('./admin/functions/student/detail',{title:"Account", studentInfo:data[0], moment, page:"Chi tiết sinh viên"})
      })
    }catch(err){
      res.flash('error', err);
      res.redirect('back');
    }
  }
})

router.get('/create',async (req, res) => {
  var student,issuer;
  try{
    await studentModel.select().then(function(data){
      return student = data;
    })
  }catch (err){
    console.log(err);
  }
  try{
    await issuerModel.issuer_select().then(function(data){
      return issuer = data;
    })
  }catch (err){
    console.log(err);
  }
  res.render('./admin/functions/account/create',{title:"Account", student, issuer, page:"Thêm mới"})
})
router.get('/update',async (req, res) => {
  var student,issuer,account;
  try{
    await accountModel.selectbyaddress(req.query.account_address).then(function(data){
      return account = data[0];
    })
  }catch (err){
    console.log(err);
  }
  try{
    await studentModel.select().then(function(data){
      return student = data;
    })
  }catch (err){
    console.log(err);
  }
  try{
    await issuerModel.issuer_select().then(function(data){
      return issuer = data;
    })
  }catch (err){
    console.log(err);
  }
  res.render('./admin/functions/account/update',{title:"Account", account, student, issuer, page:"Thêm mới"})
})
router.get('/delete', async (req, res) => {
  try{
    await accountModel.remove(req.query.account_address).then(function(data){
      console.log(data);
      req.flash('msg',data);
      res.redirect('back');
    });
  }catch(err){
    console.log(err);
    req.flash('error',err);
    res.redirect('back');
  }
})
// POST -----------------------------------------
router.post('/create', (req, res) => {
  accountController.create(req, res);
})
router.post('/update', (req, res) => {
  accountController.update(req, res);
})
module.exports = router;