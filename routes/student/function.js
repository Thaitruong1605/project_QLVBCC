const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const moment = require('moment');
const fs = require('fs');

const studentModel = require('../../models/studentModel');
const accountModel = require('../../models/accountModel');
const certificateModel = require('../../models/certificateModel')


const Web3 = require ('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

// var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
// SystemContract.setProvider(provider);

// var StudentContract = contract(JSON.parse(fs.readFileSync('./src/abis/Student.json')));
// StudentContract.setProvider(provider);

router.get('/', async (req, res)=> {
  var student_id = 'STU0001'
  var email = await studentModel.select_emailbyId(student_id);
  var certList;
  try{
    await certificateModel.select_byEmail(email.student_email).then(function(data){
      return certList = data;
    })
  }catch (err){
    console.log(err)
  }
  res.render('./student/',{title:'Danh sách văn bằng chứng chỉ.', certList});
  // var account_address = req.query.account_address
  // var stuI = new web3.eth.Contract( JSON.parse(fs.readFileSync('./src/abis/Student.json'))['abi'],'0x1a4c9c0B32bAc586636da5A7e90E15F6bBEAAe5f');
  // await web3.eth.getTransaction('0x9a541439842a3299fcfc7eabb0da5614a4a7dc2b8be92affcf1196bca59ec58f').then(console.log);
  // console.log('account_address: '+account_address);
  // var sysI = await SystemContract.deployed();
  // var stuI = await StudentContract.at('0x1a4c9c0B32bAc586636da5A7e90E15F6bBEAAe5f');
  // console.log(stuI)
  // try {
  //   await stuI.viewCertificate('0xef719f8145efc268e37cc5837e2419d9b11968a87b17f7ba7012af29a6b6aabc').then(function(data){
  //     console.log(web3.utils.soliditySha3(data['0']));
  //   });

  // }catch (err){
  //   console.log(err);
  // }
  // await stuI.once('addedCertificate', {
  //   fromBlock: 0
  // }, function(error, event){ console.log(event); });
  //   // console.log(stuI._address)


  // res.send("hello")
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
