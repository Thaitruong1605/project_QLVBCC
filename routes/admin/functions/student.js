const express = require("express");
const passport = require("passport");
const router = express.Router();
const moment = require('moment');
const StudentModel = require("../../../models/studentModel");
const StudentController = require("../../../controllers/studentController");

router.get('/', (req, res) => {
  // Lay du lieu student
  try{
    StudentModel.select().then(function(data){
      return res.render('./admin/functions/student/',{title:"Student", student_list:data, moment, page:"Danh sách"});
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
        return res.render('./admin/functions/student/update',{title:"student", student:data, moment, page:"Cập nhật"});
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
router.post('/create', (req, res) => {
  studentController.student_checkUpdate(req,res);
})
router.post('/update', (req, res) => {
  studentController.student_checkUpdate(req,res);
})
module.exports = router;