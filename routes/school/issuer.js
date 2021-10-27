const express = require('express');
const router = express.Router();
const issuerModel = require('../../models/issuerModel');

router.get('/', async(req, res) => {
  try {
    await issuerModel.select().then(function(data){
      res.render('./school/issuer',{page:'issuer', title:'Danh sách tài khoản', issuer_list: data});
    })
  }catch(err){
    console.log(err);
    req.flash('error', "Không tìm thấy dữ liệu!");
    res.redirect('/school')
  }
});


module.exports = router;