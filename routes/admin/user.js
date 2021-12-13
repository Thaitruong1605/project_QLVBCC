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

router.get('/', (req, res) => {
  try{
    userModel.select().then(function(data){
      return res.render('./admin/functions/user',{title:'Danh sách sinh viên', user_list:data, moment, page:'user'});
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
        return res.render('./admin/functions/user/update',{title:'Cập nhật sinh viên', user:data, moment, page:'user'});
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
  //1. get user info.
  var  user_idNumber = req.query.user_idNumber;
  var user_id = req.query.user_id;
  var account_address;
  try {
    await accountModel.get_accountById(user_id).then(function(data){
      return account_address = data.account_address;
    })
  }catch(err){console.log(err)}
  
  console.log(user_idNumber);
  //2. deploy / transferOwnership smart contract.
  const systemInstance = await SystemContract.deployed();
  var userCA = await systemInstance.getContractbyIDNumber(user_idNumber);

  if (userCA == '0x0000000000000000000000000000000000000000'){
    try{
      await systemInstance.createUserContractWithIDNumber(user_idNumber, systemInstance.address ,{from: process.env.SYSTEM_ADDRESS });
    }catch(err){ console.log(err); return; }
    userCA = await systemInstance.getContractbyIDNumber(user_idNumber);
  }

  var UserContract = contract(JSON.parse(fs.readFileSync('./src/abis/User.json')));
  UserContract.setProvider(provider);

  const userI = await UserContract.at(userCA)
  console.log({
    account_address, user_idNumber, userCA,
  })
  // transferOwnership
  try {
    await userI.transferOwnership(account_address,{from: process.env.SYSTEM_ADDRESS});
  }catch (err){console.log(err); return;}
  // ADD user to blockchain
  try {
    await systemInstance.addUser(account_address, user_idNumber, userCA, {from: process.env.SYSTEM_ADDRESS });
  }catch (err){console.log(err); return;}
  // 3. 
  try {
    await userModel.auth(user_idNumber)
  }catch(err){console.log(err); return }

  req.flash("msg","Xác thực tài khoản thành công!");
  return res.send({result:"redirect",url:"/admin/user"});
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