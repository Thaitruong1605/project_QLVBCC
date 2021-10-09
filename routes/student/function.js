const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");

router.get('/sendemail',(req, res) => {
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thaitruong1603@gmail.com',
      pass: '3Fifaonline'
    }
  });
  
  var mailOptions = {
    from: 'thaitruong1603@gmail.com',
    to: 'thaitruong1605@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
})

router.get('/', (req, res)=> {
  res.send('student index')
})
router.get('/add_cert',async (req, res) => {
  // await QRCode.toFile('./test.png','https://ipfs.io/ipfs/QmYej688zQ9kqB4Rn9kCuhoJtdPH1Jxbhp6AdXr623rkuC', function (err) {
  //   if (err) throw err
  //   console.log('done')
  // })

  res.render('/student/add_cert');
})
router.get('/')

module.exports = router;
