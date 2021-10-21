const express = require("express");
const router = express.Router();
const moment = require('moment');
const studentModel = require("../../../models/studentModel");
const studentController = require("../../../controllers/studentController");

router.get('/', (req, res) => {
  // Lay du lieu student
  try{
    studentModel.select().then(function(data){
      return res.render('./admin/functions/student/',{title:"Danh sách sinh viên", student_list:data, moment, page:"User"});
    })
  }catch(err){
    console.log(err);
    req.flash("error",err);
    return res.redirect("/admin");
  }
})
router.get('/update', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../../models/studentModel').select_byId(req.query.id).then(function(data){
        return res.render('./admin/functions/student/update',{title:"Cập nhật sinh viên", student:data, moment, page:"User"});
      })
    }catch(err){
      console.log(err);
      req.flash("error",err);
      return res.redirect("/admin");
    }
  }
})
// router.get('/delete', (req, res) => {
//   if( typeof req.query.id !== 'undefined'){
//     try{
//       require('../../../models/studentModel').(req.query.id);
//       return res.redirect("/admin/student");
//     }catch(err){
//       console.log(err);
//       req.flash("error",err);
//       return res.redirect("/admin/student");
//     }
//   }
// })
// POST -----------------------------------------
router.post('/create', (req, res) => {
  studentController.create(req, res);
})
router.post('/update', (req, res) => {
  studentController.update(req, res);
})
module.exports = router;