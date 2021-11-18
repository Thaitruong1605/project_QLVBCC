const express = require('express');
const passport = require('passport');
const session = require('express-session').Session;
const moment = require('moment');
const request = require("request"); 

const isStudent = require('../auth').isStudent;
const router = express.Router();
const fs = require("fs"); // file system
const CryptoJS = require('crypto-js');

// MODEL 
const certificateModel = require('../models/certificateModel')
const schoolModel = require('../models/schoolModel')


const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');

const systemContract = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/System.json'))['abi'],'0x10D8a7B2Ae872CaB10E2aB6fC6574eD2B791AAE1');

router.get('/signup',async (req, res) => {
  res.render('./signup');
})
router.post('/signup', (req, res) => {
  require('../controllers/signupControllers').createUser(req, res);
});
router.get('/login', (req, res) => { 
  res.render('./login',{title:"Đăng nhập"});
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
  res.render('./cert-search',{title:'Tra cứu văn bằng chứng chỉ',schoolList})
  
})
router.get('/cert-detail', async (req, res) =>{
  if (typeof req.query.data != 'undefined' ){
    var ipfs = await certificateModel.get_ipfs_hashbyhash(req.query.data)
    var url = "https://ipfs.io/ipfs/" + ipfs;
    console.log(url)
    request(
      {
        url: url,
        json: true,
      },
      function (error, response, data) {
        if (!error && response.statusCode === 200) {
          console.log(data);
          res.render('./cert-detail',{cert_info: data});
        }
      }
    );
  }else 
  try {
    certificateModel.select_byNumber(req.query.number).then(async function (data) {
      var filename = data[0].filename;
      if (filename != null) {
        data = JSON.parse(fs.readFileSync("./public/cert/" + filename));
        res.render('./cert-detail',{title:"Chi tiết chứng chỉ",page:"Certificate" ,cert_info: data});
      } else {
        var url = "https://ipfs.io/ipfs/" + data[0].ipfs_hash;
        request(
          {
            url: url,
            json: true,
          },
          function (error, response, data) {
            if (!error && response.statusCode === 200) {
              console.log(data);
              res.render('./cert-detail',{cert_info: data});
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
})
router.post('/activate', async (req, res) => {
  var data = {
    number: req.body.number,
    certname: req.body.certname,
    certkind: req.body.certkind,
    user_name: req.body.user_name,
    user_gender: req.body.user_gender,
    user_dayofbirth: req.body.user_dayofbirth,
    user_placeofbirth: req.body.user_placeofbirth,
    course_name: req.body.course_name,
    duration: req.body.duration,
    testday: req.body.testday,
    classification: req.body.classification,
    signday: req.body.signday,
    regno: req.body.regno,
  }
  var hashed_data = CryptoJS.SHA256(Object.toString(data), {asBytes: true});
  msg = hashed_data.toString(CryptoJS.enc.Hex);
  req.flash("msg", msg);
  res.redirect('back');
})
router.get('/nhap-chung-chi', (req, res)=>{
  res.render('./cert-input');
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
router.get('/qrscan', (req, res) => {
  res.render('./qrscan',{title:'Tua cứu chứng chỉ bằng mã QR'})
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
// router.get('/render-test', async (req, res)=> {
//   var schoolList ;
//   try{
//     await schoolModel.school_select().then(function(data){
//       return schoolList = data;
//     })
//   }catch(err){
//     console.log(err);
//   }
//   res.render('./search-form.ejs',{title:'Tra cứu văn bằng chứng chỉ',schoolList});
// })
module.exports = router;