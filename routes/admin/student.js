const express = require('express');
const router = express.Router();
const moment = require('moment');
const studentModel = require('../../models/studentModel');
const studentController = require('../../controllers/studentController');
const accountModel = require('../../models/accountModel');
const fs = require('fs');

const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

router.get('/', (req, res) => {
  try{
    studentModel.select().then(function(data){
      return res.render('./admin/functions/student',{title:'Danh sách sinh viên', student_list:data, moment, page:'User'});
    })
  }catch(err){
    console.log(err);
    return res.redirect('/admin');
  }
})
router.get('/update', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../models/studentModel').select_byId(req.query.id).then(function(data){
        return res.render('./admin/functions/student/update',{title:'Cập nhật sinh viên', student:data, moment, page:'User'});
      })
    }catch(err){
      console.log(err);
      req.flash('error',err);
      return res.redirect('/admin/student');
    }
  }
})
router.get('/delete', async (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      await studentModel.remove(id);
      req.flash('msg','Xoá sinh viên thành công!');
      return res.redirect('/admin/student');
    }catch(err){
      console.log(err);
      return res.redirect('/admin/student');
    }
  }
})
router.get('/active-student', async (req, res) => {
  console.log('active-student');
  if ( typeof req.query.id !== 'undefined'){
    var sysABI = JSON.parse(await fs.readFileSync('./src/abis/System.json'))['abi'];
    var system = new web3.eth.contract(sysABI,process.env.SYSTEM_ADDRESS);
    
  }
})
// POST -----------------------------------------
router.post('/get-data', async (req, res) => {
  var student_id = req.body.id;
  var student_info, account_info;
  try {
    await studentModel.select_byId(student_id).then(function(data){
      return student_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  try {
    await accountModel.get_accountById(student_id).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  student_info.student_birth = moment(student_info.student_birth).format('DD/MM/YYYY');
  res.json({student_info, account_info});
});
router.post('/update', (req, res) => {
  studentController.update(req, res);
})
module.exports = router;