const express = require('express');
const router = express.Router();
const moment = require('moment');
const userModel = require('../../models/userModel');
const userController = require('../../controllers/userController');
const accountModel = require('../../models/accountModel');
const fs = require('fs');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);
var StudentContract = contract(JSON.parse(fs.readFileSync('./src/abis/Student.json')));
StudentContract.setProvider(provider);

router.get('/test',async (req, res)=>{
  // const systemInstance = await SystemContract.deployed();
  // const userInstance = await StudentContract.new('0x19f7b3A4805F98aF3799B79f1178f752b9683017',{from:"0x3E5C773519D38EB7996A5cADFDb8C8256889cB79"});

  // console.log(userInstance.address)
})
router.get('/', (req, res) => {
  try{
    userModel.select().then(function(data){
      return res.render('./admin/functions/user',{title:'Danh sách sinh viên', user_list:data, moment, page:'User'});
    })
  }catch(err){
    console.log(err);
    return res.redirect('/admin');
  }
})
router.get('/update', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../models/userModel').select_byId(req.query.id).then(function(data){
        return res.render('./admin/functions/user/update',{title:'Cập nhật sinh viên', user:data, moment, page:'User'});
      })
    }catch(err){
      console.log(err);
      req.flash('error',err);
      return res.redirect('/admin/user');
    }
  }
})
router.get('/delete', async (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      await userModel.remove(id);
      req.flash('msg','Xoá sinh viên thành công!');
      return res.redirect('/admin/user');
    }catch(err){
      console.log(err);
      return res.redirect('/admin/user');
    }
  }
})
router.get('/auth',async (req, res)=>{
  if (typeof req.query.user_id == 'undefined'){
    req.flash('Hành động không hợp lệ!')
  }else {
    try{
      await userModel.auth(req.query.user_id);
      var account = await accountModel.get_accountById(req.query.user_id);
      console.log(account);
      const systemInstance = await SystemContract.deployed();
      try {
        console.log(systemInstance.address);
        console.log(account.account_address);
        const userInstance = await StudentContract.new(account.account_address,systemInstance.address,{from:"0x3E5C773519D38EB7996A5cADFDb8C8256889cB79"});
        console.log(userInstance.address) 
        await systemInstance.addStudent(account.account_address, req.query.user_idNumber,userInstance.address,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
        req.flash('Xác thực sinh viên thành công');
      }catch (err){
        console.log(err);
      }
    }catch(err){
      console.log(err);
    }
  }
  res.redirect('/admin/user');
})
// POST -----------------------------------------
router.post('/get-data', async (req, res) => {
  var user_id = req.body.id;
  var user_info, account_info;
  try {
    await userModel.select_byId(user_id).then(function(data){
      return user_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  try {
    await accountModel.get_accountById(user_id).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  console.log(user_info);
  user_info.user_birth = moment(user_info.user_birth).format('DD/MM/YYYY');
  res.json({user_info, account_info});
});
router.post('/update', (req, res) => {
  userController.update(req, res);
})
module.exports = router;