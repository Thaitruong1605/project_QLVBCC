const express = require('express');
const passport = require('passport');
const router = express.Router();
const moment = require('moment');
// const schoolController = require('../../controllers/schoolController');
const schoolModel = require('../../models/schoolModel');
const accountModel = require('../../models/accountModel');
const fs = require('fs');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const sysAddr = '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

// GET --------------------------------
router.get('/', (req, res) => {
  // Lay du lieu school
  try{
    require('../../models/schoolModel').school_select().then(function(data){
      return res.render('./admin/functions/school',{title:'Danh sách trường', school_list:data, moment, page:'school'});
    })
  }catch(err){
    console.log(err);
    req.flash('error',err);
    return res.redirect('/admin');
  }
})
router.get("/valid", async (req, res)=>{
  if (typeof req.query.id == "undefined") 
    return;
  let school_id= req.query.id;
  let school_info, account_address;
  try {
    await accountModel.get_accountById(school_id).then(function(data){
      return account_address = data.account_address;
    })
  }catch(err){console.log(err); }
  try {
    await schoolModel.school_selectbyId(school_id).then(function(data){
      return school_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  const sysI = await SystemContract.deployed();
  try {
    await sysI.addSchool(
      school_info.school_name,
      school_info.school_code,
      school_info.school_placeAddress,
      school_info.school_phoneNumber,
      school_info.school_email,
      school_info.school_fax,
      school_info.school_website,
      account_address,
      {from: process.env.SYSTEM_ADDRESS});
  }catch(err){console.log(err); return;}
  try {
    await accountModel.update_school({account_status:"active"},school_id);
  }catch(err){console.log(err);}
  try {
    await schoolModel.school_update(school_id, {isValid: 1});
    req.flash("msg",`Tạo mới hợp đồng thông minh cho "${school_info.school_name}" thành công!`);
  }catch(err){
    console.log(err);
  }
  res.redirect("/admin/school");
})
// POST --------------------------------
router.post('/get-data', async (req, res) => {
  var school_id = req.body.id;
  var school_info, account_info;
  try {
    await schoolModel.school_selectbyId(school_id).then(function(data){
      return school_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  try {
    await accountModel.get_accountById(school_id).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  school_info.school_createTime = moment(school_info.school_createTime).format('DD-MM-YYYY, h:mm:ss a');
  school_info.school_modifyTime = moment(school_info.school_modifyTime).format('DD-MM-YYYY, h:mm:ss a');
  res.json({school_info, account_info});
})
router.post('/create',async (req, res) => {
  // get Data
  var error = [];
  let account_info = {
    school_id: "",
    account_address: req.body.account_address.trim(),
    account_username: req.body.account_username.trim(),
    account_type:"school",
    account_password: req.body.account_password.trim(),
    account_status: "lock",
  }
  
  if (account_info.account_username == '' || account_info.account_password == '' ){ error.push("Vui lòng nhập thông tin đăng nhập!"); }
  if (account_info.account_password != req.body.account_password2){  error.push("Mật khẩu không trùng khớp!"); } 
  else {  account_info.account_password = await bcrypt.hashSync(account_info.account_password, saltRounds); }
  
  let school_info = {
    school_name: req.body.school_name.trim(),
    school_code: req.body.school_code.trim(),
    isValid: 0,
    school_placeAddress: req.body.school_placeAddress.trim(),
    school_phoneNumber: req.body.school_phoneNumber.trim(),
    school_email: req.body.school_email.trim(),
    school_fax: req.body.school_fax.trim(),
    school_website: req.body.school_website.trim(),
  }

  for (var attr in school_info) {
    if (typeof attr == "undefined") {
      error.push("Vui lòng nhập đầy đủ thông tin!");
      break;
    }
  }

  if (error == '') {
    try{
      await schoolModel.school_create(school_info);
    }catch (err){console.log(err); req.flash("error",`Thêm thông tin trường thất bại`); /*return res.redirect("/admin/school/");*/}

    try{
      await schoolModel.school_getIdbyEmail(school_info.school_email).then(function(data){
        account_info.school_id = data.school_id;
      })
    }catch(err){console.log (err); /*return res.redirect("/admin/school/");*/}

    try{
      await accountModel.create(account_info)
    }catch(err){console.log (err); req.flash("error",`Thêm tài khoản trường thất bại`);  /*return res.redirect("/admin/school/");*/}

    req.flash("msg",`Tạo tài khoản của "${school_info.school_name}" thành công!`);
    return res.redirect("/admin/school/");
  
  }else {
    req.flash("error", error);
    return res.redirect("/admin/school/");
  }
})
router.post('/update',async(req, res) => {
  console.log(req.body);
  let school_id= req.body.school_id;
  let school_info = {
    school_name: req.body.school_name.trim(),
    school_code: req.body.school_code.trim(),
    school_placeAddress: req.body.school_placeAddress.trim(),
    school_phoneNumber: req.body.school_phoneNumber.trim(),
    school_email: req.body.school_email.trim(),
    school_fax: req.body.school_fax.trim(),
    school_website: req.body.school_website.trim(),
  }
  try{
    await schoolModel.school_update(school_id,school_info);
    req.flash("msg",`Cập nhật ${school_id} thành công`);
  }catch(err){
    console.log(err);
    req.flash("err",`Cập nhật ${school_id} thất bại`);
  }
  return res.redirect("/admin/school");
})
router.post('/delete',async (req, res) => {
  if( typeof req.body.id == 'undefined')
    return;
  try{ 
    await accountModel.removeSchoolAccounts(req.body.id);
  }catch(err){console.log(err);}

  try{
    await schoolModel.school_delete(req.body.id);
    req.flash("msg",`Xoá trường ${req.body.id} thành công!` );
  }catch(err){ console.log(err); req.flash("error",`Xoá trường ${req.body.id} không thành công!` );}
 
  return res.send({result:"redirect", url:"/admin/school"});
})
module.exports = router