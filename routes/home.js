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
  res.render('./', { page_name: 'Trang chủ' });
});
router.get('/test', function (req, res) {
  console.log(JSON.stringify(JSON.parse(fs.readFileSync('./public/cert/cert_' + 3 +'.json'))));
});

// Tra cứu chứng chỉ 
router.post('/cert-search',async (req ,res) => {
  if ((req.body.student_name == '' || req.body.number == '' || req.body.regno == '') && req.body.cn_id == '' ){
    req.flash('err','Vui lòng nhập thông tin tìm kiếm');
    return res.send();
  }
  var student_name = (req.body.student_name).trim().toUpperCase(),
  number=  req.body.number.trim(),
  regno= req.body.regno.trim(),
  cn_id = req.body.cn_id;
  try{
    await certificateModel.cert_search(cn_id,number,student_name,regno).then(async function(data){
      var certList = data;
      certList.forEach(function(elt){
        elt.student_birth = moment(elt.student_birth).format('DD/MM/YYYY');
      })
      return res.send({certList,moment});
    })
  }catch (err){ 
    console.log(err);
    return res.redirect('back');
  }
})
router.get('/cert-search',async (req ,res) => {
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
              res.render('./issuer/certificate/detail',{cert_info: data});
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
    student_name: req.body.student_name,
    student_gender: req.body.student_gender,
    student_dayofbirth: req.body.student_dayofbirth,
    student_placeofbirth: req.body.student_placeofbirth,
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
  res.render('./qrscan')
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