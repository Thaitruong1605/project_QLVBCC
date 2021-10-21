const express = require('express');
const passport = require('passport');
const session = require('express-session').Session;
const isStudent = require('../auth').isStudent;
const router = express.Router();
const fs = require("fs"); // file system
const certificateModel = require('../models/certificateModel')
const CryptoJS = require('crypto-js');

const loginController = require("../controllers/loginController");

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
router.get('/asd', function (req, res) {
  req.flash("alert",'adasdasd')
  res.redirect('/');
});

// Tra cứu chứng chỉ 
router.get('/cert-search', (req ,res) => {
  res.render('./cert-search')
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

router.get('/qrscan', (req, res) => {
  res.render('./qrscan')
})

module.exports = router;