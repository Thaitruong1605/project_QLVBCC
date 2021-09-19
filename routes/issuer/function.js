const express = require("express");
const passport = require("passport");
const router = express.Router();
const fs = require('fs')
const moment = require("moment");

router.get('/',(req, res) => {
  res.render('./issuer');
})
router.get('/certificate/create', (req, res) => {
  
  res.render('./issuer/certificate/create');
})
router.get('/certificate', (req, res) => {
  try{
    require("../../models/certificateModel").select_byissuer("ISR0001").then(function(data){
      // console.log(data);
      res.render('./issuer/certificate/',{cert_list: data, moment});
    })
  }catch(err){
    console.log(err);
    // res.redirect("/issuer");
  }
})
router.get('/certificate/edit', (req, res) => {
  res.render('./issuer/certificate/edit');
})

router.post('/create_certificate', (req, res) => {
  var data = req.body;
  console.log(data);
  var fname = 'cert_'+data.number+'_'+Date.now()+'.json'; 
  fs.appendFile('./public/cert/cert_'+fname, JSON.stringify(data), function(err) {
    if (err){
      console.log(err);
    }else {
       
    }
  })

})


module.exports = router