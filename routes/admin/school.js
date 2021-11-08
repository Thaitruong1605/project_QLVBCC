const express = require('express');
const passport = require('passport');
const router = express.Router();
const moment = require('moment');
const schoolController = require('../../controllers/schoolController');
const schoolModel = require('../../models/schoolModel');
const accountModel = require('../../models/accountModel');
const fs = require('fs');

const sysAddr = '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

// GET --------------------------------
router.get('/school_create_contract',async (req, res)=> {
  const systemInstance = await SystemContract.deployed();
  await systemInstance.addSchool(
    'Đại học Cần Thơ',
    'Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', 
    '(84-292) 383266', 'dhct@ctu.edu.vn', 
    '(84-292) 383847', 
    'www.ctu.edu.vn', 
    '0x70cE91A72dbE08aaD8766aE09E977d559C13B806',
    {from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
})
router.get('/', (req, res) => {
  // Lay du lieu school
  try{
    require('../../models/schoolModel').school_select().then(function(data){
      return res.render('./admin/functions/school',{title:'Danh sách trường', school_list:data, moment, page:'User'});
    })
  }catch(err){
    console.log(err);
    req.flash('error',err);
    return res.redirect('/admin');
  }
})
router.get('/create', (req, res) => {
  res.render('./admin/functions/school/create',{title:'School',page:'Thêm mới'})
})
router.get('/update', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../models/schoolModel').school_selectbyId(req.query.id).then(function(data){
        return res.render('./admin/functions/school/update',{title:'Cập nhật thông tin trường',page: 'User', school:data[0], moment});
      })
    }catch(err){
      console.log(err);
      req.flash('error',err);
      return res.redirect('/school');
    }
  }
})

router.get('/delete', (req, res) => {
  if( typeof req.query.id !== 'undefined'){
    try{
      require('../../models/schoolModel').school_delete(req.query.id);
      return res.redirect('/admin/school');
    }catch(err){
      console.log(err);
      req.flash('error',err);
      return res.redirect('/admin/school');
    }
  }
})
// POST --------------------------------
router.post('/get-data', async (req, res) => {
  var school_id = req.body.id;
  var school_info, account_info;
  try {
    await schoolModel.school_selectbyId(school_id).then(function(data){
      return school_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  try {
    await accountModel.get_accountById(school_id).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
  school_info.school_createTime = moment(school_info.school_createTime).format('DD-MM-YYYY, h:mm:ss a');
  school_info.school_modifyTime = moment(school_info.school_modifyTime).format('DD-MM-YYYY, h:mm:ss a');
  res.json({school_info, account_info});
})
router.post('/create', (req, res) => {
  schoolController.school_create(req,res);
})
router.post('/update', (req, res) => {
  schoolController.school_checkUpdate(req,res);
})

module.exports = router