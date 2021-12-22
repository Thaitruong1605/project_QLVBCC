const express = require('express');
const passport = require('passport');
const session = require('express-session').Session;
const moment = require('moment');
const request = require("request"); 
const CryptoJS = require('crypto-js');

const router = express.Router();
const fs = require("fs"); // file system

const certificateModel = require('../models/certificateModel')
const schoolModel = require('../models/schoolModel')

const Web3 = require ('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.get('/signup',async (req, res) => {
  res.render('./signup',{title:"Đăng ký",page:'signup'});
})
router.post('/signup', (req, res) => {
  require('../controllers/signupControllers').createUser(req, res);
});
router.get('/login', (req, res) => { 
  res.render('./login',{title:"Đăng nhập",page:'login'});
})
router.post('/login',
  passport.authenticate('local', {
      successRedirect: 'back',
      failureRedirect: 'back',
      failureFlash: true
  })
);
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
router.get('/', function (req, res) {
  res.redirect('/tra-cuu')
});

// Tra cứu chứng chỉ 
router.post('/tra-cuu',async (req ,res) => {
  if ((req.body.user_name == '' || req.body.number == '' || req.body.regno == '') && req.body.cn_id == '' ){
    req.flash('err','Vui lòng nhập thông tin tìm kiếm');
    return res.send();
  }
  var user_name = (req.body.user_name).trim().toUpperCase(),
  number=  req.body.number.trim(),
  regno= req.body.regno.trim(),
  cn_id = req.body.cn_id;
  try{
    await certificateModel.cert_search(cn_id,number,user_name,regno).then(async function(data){
      var certList = data;
      certList.forEach(function(elt){
        elt.user_birth = moment(elt.user_birth).format('DD/MM/YYYY');
      })
      return res.send({certList,moment});
    })
  }catch (err){ 
    console.log(err);
    return res.redirect('back');
  }
})
router.get('/tra-cuu',async (req ,res) => {
  var schoolList ;
  try{
    await schoolModel.school_select().then(function(data){
      return schoolList = data;
    })
  }catch(err){
    console.log(err);
  }
  res.render('./cert-search',{title:'Tra cứu văn bằng chứng chỉ',schoolList, page:"tra-cuu"})
  
})
router.post('/cert-detail', async (req, res) =>{
  var cert_info = "";
  try {
    var data = fs.readFileSync('./public/cert/cert_' + req.body.number+'.json')
    cert_info = JSON.parse(data);
    return res.json({cert_info});
  }catch {
    try {
      await certificateModel.get_ipfs_hash(req.body.number).then(function(data){
        var ipfs= data;
        var url = 'https://ipfs.io/ipfs/' + ipfs;
        request(
          {
            url: url,
            json: true,
          },
          function (error, response, data) {
            if (!error && response.statusCode === 200) {
              cert_info = data;
              return res.json({cert_info});
            }
          }
        );
      })
    }catch(err){
      console.log(err);
    }
  }
})
router.post('/verification', async (req, res) => {
  var ipfs_hash;
  try{
    await certificateModel.get_ipfs_hash(req.body.number).then(function(data){
      return ipfs_hash = data;
    })
  }catch(err) {
    console.log(err);
  }
  var url = 'https://ipfs.io/ipfs/' + ipfs_hash;
  await request( { url: url, json: true }, function (error, response, data) {
        if (!error && response.statusCode === 200) {
          // console.log("0x"+CryptoJS.SHA256(JSON.stringify(data)));
          res.send({hash:"0x"+CryptoJS.SHA256(JSON.stringify(data))})
        }
      }
    );
})
router.post('/check-hash', async (req, res) => {
  var hash = req.body.hash,
  number = req.body.number,
  user_idNumber;
  try {
    await certificateModel.get_idNumberByCertNumber(number).then(function(data){
      return user_idNumber = data
    })
  }catch(err){
    console.log(err)
  }
  console.log(user_idNumber)
  const systemInstance = await SystemContract.deployed();
  var userCA = await systemInstance.getContractbyIDNumber(user_idNumber);
  if (userCA == "0x0000000000000000000000000000000000000000"){
    return res.send({status: -1})
  }
  let UserContract = contract(JSON.parse(fs.readFileSync('./src/abis/User.json')));
  UserContract.setProvider(provider); // set provider.
  let userI = await UserContract.at(userCA);
  let rlt ;
  let certStatus = -1; // 1 - Đã xác thực; 0 - Thu hồi;
  try {
    rlt = await userI.viewCertificate(hash);
  }catch (err){ throw(err)
  }
  if(parseInt(rlt[0], 2) == 0 ){
    certStatus = 0;
  }else if ( parseInt(rlt[0], 2) == 1 ){
    certStatus = 1; 
  }

  // var digit = parseInt(rlt[0], 2);
  console.log("Chứng thực văn bằng: "+ certStatus)
  res.send({status: certStatus})
})
//qrscan 
router.post('/get-certkind', async (req, res)=>{
  // console.log(req.body.school_id);
  try{
    await certificateModel.certkind_getbyschool(req.body.school_id).then(function(data){
      res.send({kindList:data});
    })
  }catch(err){
    console.log(err);
  }
})
router.post('/get-certName', async (req, res)=>{
  try{
    await certificateModel.certname_getbyKindId(req.body.ck_id).then(function(data){
      res.send({nameList:data});
    })
  }catch(err){
    console.log(err);
  }
})
router.post('/get-detai-by-ipfs', async (req, res) => {
  console.log(req.body);
  var url = 'https://ipfs.io/ipfs/' + req.body.ipfs;
  await request(
    {
      url: url,
      json: true,
    },
    function (error, response, data) {
      if (!error && response.statusCode === 200) {
        cert_info = data;
        res.send({cert_info});
      }else res.send();
    }
  );
})
module.exports = router;