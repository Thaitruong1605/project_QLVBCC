const express = require("express");
const passport = require("passport");
const router = express.Router();
const moment = require('moment');
const issuerController = require("../../../controllers/issuerController");

// GET --------------------------------
router.get('/', (req, res) => {
  // Lay du lieu issuer
  try{
    require('../../../models/issuerModel').issuer_select().then(function(data){
      return res.render('./admin/functions/issuer/',{title:"Issuer", issuer_list:data, moment, page:"Danh sách"});
    })
  }catch(err){
    console.log(err);
    req.flash("error",err);
    return res.redirect("/admin");
  }
})
router.get('/create', (req, res) => {
  res.render('./admin/functions/issuer/create',{title:"Issuer",page:"Thêm mới"})
})
router.get('/update', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../../models/issuerModel').issuer_selectbyId(req.query.id).then(function(data){
        return res.render('./admin/functions/issuer/update',{title:"Issuer",page: "Cập nhật", issuer:data[0], moment});
      })
    }catch(err){
      console.log(err);
      req.flash("error",err);
      return res.redirect("/student");
    }
  }
})

router.get('/delete', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../../models/issuerModel').issuer_delete(req.query.id);
      return res.redirect("/admin/issuer");
    }catch(err){
      console.log(err);
      req.flash("error",err);
      return res.redirect("/admin/issuer");
    }
  }
})
// POST --------------------------------

router.post('/create', (req, res) => {
  issuerController.issuer_checkUpdate(req,res);
})
router.post('/update', (req, res) => {
  issuerController.issuer_checkUpdate(req,res);
})

module.exports = router