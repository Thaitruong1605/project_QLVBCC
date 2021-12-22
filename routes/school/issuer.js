const express = require('express');
const router = express.Router();
const issuerModel = require('../../models/issuerModel');
const accountModel = require('../../models/accountModel');

var Accounts = require('web3-eth-accounts');
// var accounts = new Accounts('HTTP://127.0.0.1:7545');

const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;

router.get('/', async(req, res) => {
  try {
    await issuerModel.select(req.user.school_id).then(function(data){
      return res.render('./school/issuer',{page:'Issuer', title:'Danh sách tài khoản', issuer_list: data});
    })
  }catch(err){
    console.log(err);
    req.flash('error', "Không tìm thấy dữ liệu!");
    return res.redirect('/school');
  }
});
router.post('/update', async (req, res) => {
  var error = [];

  var issuer_info = {
    issuer_name: req.body.issuer_name, 
    issuer_phoneNumber: req.body.issuer_phoneNumber, 
    issuer_email: req.body.issuer_email, 
  }
  if (
    issuer_info.issuer_name == '' ||
    issuer_info.issuer_phoneNumber == '' ||
    issuer_info.issuer_email == ''
  ) error.push('Vui lòng nhập đầy đủ thông tin!');
  var account_info = {
    account_status: req.body.account_status
  }
  if (req.body.account_password == ""){    
  }else if (req.body.account_password != req.body.account_password2)
    error.push('Mật khẩu xác nhận không giống!');
  else {
    account_info.account_password= await bcrypt.hashSync(req.body.account_password, saltRounds);
  }

  if (error != ''){
    req.flash('error',error);
    res.redirect('/school/issuer');
  }else {
    try {
      await issuerModel.update(issuer_info, req.body.issuer_id);
    }catch (err){
      console.log(err);
      // return res.redirect('/school/issuer');
    }
  
    try{
      await accountModel.update(account_info, req.body.account_username);
      req.flash('msg','Cập nhật tài khoản người phát hành thành công!');
      return res.redirect('/school/issuer');
    }catch(err){
      console.log(err);
      // return res.redirect('/school/issuer');
    }
  }

  
});
router.post('/create', async (req, res) => {
  var error = [];
  var issuer_info = {
    issuer_name: req.body.issuer_name, 
    issuer_phoneNumber: req.body.issuer_phoneNumber, 
    issuer_email: req.body.issuer_email, 
  }
  if (
    issuer_info.issuer_name == '' ||
    issuer_info.issuer_phoneNumber == '' ||
    issuer_info.issuer_email == ''
  ) error.push('Vui lòng nhập đầy đủ thông tin!');
  if (req.body.password != req.body.password2)
  error.push('Mật khẩu xác nhận không giống!');
  else {
    var account_info = {
      account_username: req.body.account_username, 
      account_status: 'active', 
      account_type: 'issuer',
      account_password: await bcrypt.hashSync(req.body.account_password, saltRounds),
      school_id: req.user.school_id,
      account_address: "NULL"
    }
  }
  if (error != ''){
    req.flash('error',error);
    return res.redirect('/school/issuer');
  }
  try {
    await issuerModel.create(issuer_info);
  }catch (err){
    console.log(err);
    return res.redirect('/school/issuer');
  }
  try{
    await issuerModel.getIdbyEmail(req.body.issuer_email).then(async function(data){
      account_info.issuer_id = data;
      try{
        await accountModel.create(account_info);
        req.flash('msg','Thêm tài khoản người phát hành thành công!');
        return res.redirect('/school/issuer');
      }catch(err){
        console.log(err);
        return res.redirect('/school/issuer');
      }
    })
  }catch(err){
    console.log(err);
    return res.redirect('/school/issuer');
  }
});
router.post('/get-data', async (req, res) => {
  var issuer_id = req.body.id;
  var issuer_info,
  account_info;
  try{
    await issuerModel.selectById(issuer_id).then(function(data){
      return issuer_info = data;
    })
  }catch(err){
    console.log( err);
    return res.redirect('/school/issuer');
  }
  try{
    await accountModel.get_accountById(issuer_id).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    return res.redirect('/school/issuer');
  }
  return res.json({issuer_info,account_info});
})
router.post('/delete', async (req, res) => {
  try{ 
    await accountModel.removeByIssuerId(req.body.id).then( async function(){
      try{
        await issuerModel.remove(req.body.id);
        req.flash('msg','Xoá tài khoản thành công');
        return res.status(200).send({result: 'redirect', url:'/school/issuer'})
      }catch(err){
        console.log(err);
        return res.status(200).send({result: 'redirect', url:'/school/issuer'})
      }
    });
  }catch(err){
    console.log(err);
    return res.status(200).send({result: 'redirect', url:'/school/issuer'})

  }
})
module.exports = router;