const express = require('express');
const router = express.Router();
const moment = require('moment');
const studentModel = require('../../models/studentModel');
const studentController = require('../../controllers/studentController');
const accountModel = require('../../models/accountModel');
const fs = require('fs');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

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
// router.get('/active-student', async (req, res) => {
//   if ( typeof req.query.id !== 'undefined'){
//     console.log('active-student');
//     const systemInstance = await SystemContract.deployed();
//     try { 
//       await studentModel.auth(req.query.id)
//     }catch(err){
//       console.log(err);
//     }
//     try {
//       await systemInstance.addStudent();
//     }catch (err){
//       console.log(err);
//     }
//   }
// })
router.get('/auth',async (req, res)=>{
  if (typeof req.query.student_id == 'undefined'){
    req.flash('Hành động không hợp lệ!')
  }else {
    try{
      await studentModel.auth(req.query.student_id);
      var account = await accountModel.get_accountById(req.query.student_id);
      try {
        const systemInstance = await SystemContract.deployed();
        await systemInstance.addStudent(account.account_address,req.query.student_email,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
        req.flash('Xác thực sinh viên thành công');
      }catch (err){
        console.log(err);
      }
    }catch(err){
      console.log(err);
    }
  }
  res.redirect('/admin/student');
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
  console.log(student_info);
  student_info.student_birth = moment(student_info.student_birth).format('DD/MM/YYYY');
  res.json({student_info, account_info});
});
router.post('/update', (req, res) => {
  studentController.update(req, res);
})
module.exports = router;