const express = require("express");
const router = express.Router();
const certificateModel = require("../../models/certificateModel");
const accountModel = require("../../models/accountModel");
const moment = require("moment");
const fs = require("fs"); // file system
const request = require("request"); 
const hash = require('object-hash'); 
const CryptoJS = require('crypto-js');
const ipfsClient = require("ipfs-http-client");
const { Certificate } = require("crypto");

const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;

const Web3 = require ('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

const QRCode = require('qrcode');

const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

client.pin.add("QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn").then((res) => {
});

// CHỨNG CHỈ ------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  var kindlist, namelist, certlist, kindList;
  try { await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindList = data;
    })
  }catch(err){
    console.log(err);
  }
  try{ await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist= data;
    });
  }catch(err){
    console.log(err);
    return res.redirect('/school');
  }
  try{ await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist= data;
    });
  }catch(err){
    console.log(err);
    return res.redirect('/school');
  }
  try { await certificateModel.select_byschool(req.user.school_id).then(function (data) {
      return certlist= data;
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/school');
  }
  if (kindlist !='' && namelist !=''){
    return res.render("./school/cert/", {page:'Certificate', title:'Danh sách chứng chỉ', kindlist, namelist, certlist, moment ,kindList});
  }
  req.flash('err','Không thể truy cập');
  return res.redirect('/school');
});
router.get("/issue", async (req, res) => {
  if(typeof req.query.number == 'undefined '){
    req.flash("error","Phát hành chứng chỉ thất bại!");
    return res.redirect("/school/cert");
  } 
  // I. Create system Instance
    const systemInstance = await SystemContract.deployed();
  // II. Get user contract 
    var stuCA = await systemInstance.getContractbyIDNumber(req.query.user_idNumber);
    console.log(stuCA)
    if (stuCA == '0x0000000000000000000000000000000000000000'){
      try{
        await systemInstance.createTempContractbyIDNumber(req.query.user_idNumber, systemInstance.address ,{from: "0x3E5C773519D38EB7996A5cADFDb8C8256889cB79" });
      }catch(err){
        console.log(err);
      }
      stuCA = await systemInstance.getContractbyIDNumber(req.query.user_idNumber);
    }
  // III. Add cert to user's contracts
    // 1. Create user Instance
    var StudentContract = contract(JSON.parse(fs.readFileSync('./src/abis/Student.json')));
    StudentContract.setProvider(provider); // set provider.
    var stuI = await StudentContract.at(stuCA);
    // 4. Hash cert_json
    var path= './public/cert/cert_' + req.query.number +'.json';
    var hashed_data = CryptoJS.SHA256(JSON.stringify(JSON.parse(fs.readFileSync(path))));
    // 3. Up cert_json to IPFS. 
    const file = await client.add(
      ipfsClient.globSource(path)
    );
    var ipfs_hash = file.cid.toString();
    // 4. Generate QR for cert.
    QRCode.toFile(
      './public/qrCode/cert_'+ req.query.number +'.png', 
      'http://localhost:3000/cert-detail?data=0x'+hashed_data, 
      function (err) { if (err) console.log(err); }
    );
    // 5. Update cert_hash to user's contract.
    try {
      await stuI.addCertificate('0x'+hashed_data,{from: req.user.account_address});
    }catch (err){
      console.log(err);
    }
    // 6. Update cert_info in database.
    try {
      await certificateModel.update_ipfs_hash(req.query.number, ipfs_hash);
      fs.unlink(path,(err=>{if(err) console.log(err);}));
      req.flash('msg','Cáp phát chứng chỉ thành công!');
      return res.redirect('/school/cert');
    } catch (err) {
      console.log(err);
    }
});
router.get('/set-to-incorrect', async(req, res )=> {
  if (typeof req.query.number == 'undefined'){
    req.flash('error','Không tìm thấy thông tin');
    res.redirect('back');
  }else {
    var cert = {
      status: 'incorrect'
    }
    try {
      await certificateModel.update(req.query.number, cert);
      req.flash('msg','Cập nhật chứng chỉ thành công');
      res.redirect('back');
    }catch(err){
      console.log(err);
      res.redirect('back');
    }
  }
})
router.post('/list-cert', async (req, res) => {
  data = {
    cn_id: req.body.cn_id,
    fromDate: moment(req.body.fromDate,'DD/MM/YYYY').format(),
    toDate: moment(req.body.toDate,'DD/MM/YYYY').format(),
    user_name: req.body.user_name,
    number: req.body.number,
    regno: req.body.regno,
  }
  console.log(data);
  try {
    await certificateModel.list_cert(data).then(function(results){
      return res.send({certList:results});
    })
  }catch(err){
    console.log(err);
  }
})
// CERTNAME ---------------------------------------------------------------------------------------------
router.get('/certname',async (req, res) => {
  var kind_list, name_list;
  try {
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kind_list = data;
    });
  }catch(err){
    console.log(err);
  }
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data) { 
      return name_list = data;
    })
  }catch(err){
    console.log(err);
  }
  if (kind_list == '' && name_list == ''){
    return res.redirect('/school');
  }else {
    return res.render('./school/cert/certname',{page:'Certname',title:'Danh sách tên chứng chỉ',kind_list, name_list})
  }
})
router.post('/certname/create', async (req, res) => {
  if(req.body.cn_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/school/cert/certname');
  }else {
    try{
      await certificateModel.certname_create( req.user.school_id, req.body.ck_id, req.body.cn_name);
      req.flash("msg","Thêm mới tên chứng chỉ thành công!");
      res.redirect('/school/cert/certname');
    }catch(err){
      console.log(err);
      res.redirect('/school/cert/certname');
    }
  }
})
router.post('/certname/update', (req, res) => {
  try{
    certificateModel.certname_update(req.body.cn_id,req.body.cn_name).then(function(){
      req.flash('msg',"Cập nhập tên chứng chỉ thành công!");
      res.redirect('/school/cert/certname');
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/cert/certname');
  }
})
router.post('/certname/remove', async (req, res )=> {
  try{
    await certificateModel.certname_remove(req.user.school_id, req.body.id).then(function(){
      req.flash("msg","Xoá tên chứng chỉ thành công!");
    })
  }catch(err){
    console.log(err);
    req.flash("error","Xoá tên chứng chỉ thất bại!");
  }
  return res.status(200).send({result: 'redirect', url:'/school/cert/certname'});
})

// 3. CERTKIND -----------------------------------------------------------------------------
router.get('/certkind', async (req, res) => {
  try{
    certificateModel.certkind_getbyschool(req.user.school_id).then(function(data) {
      res.render('./school/cert/certkind',{page:'Certkind',title:'Danh sách loại chứng chỉ',kind_list:data})
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
})
router.post('/certkind/create', async (req, res) => {
  if(req.body.ck_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/school/cert/certkind');
  }else {
    try{
      await certificateModel.certkind_create(req.user.school_id, req.body.ck_name);
      req.flash("msg","Thêm mới loại chứng chỉ thành công!");
      res.redirect('/school/cert/certkind');
    }catch(err){
      console.log(err);
      res.redirect('/school/cert/certkind');
    }
  }
})
router.post('/certkind/update', (req, res) => {
  try{
    certificateModel.certkind_update(req.body.ck_id, req.body.ck_name).then(function(){
      req.flash('msg',"Cập nhập loại chứng chỉ thành công!");
      res.redirect('/school/cert/certkind');
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/cert/certkind');
  }
})
router.get('/certkind/remove', (req, res )=> {
  if (typeof req.query.id != 'undefined'){
    try{
      certificateModel.certkind_remove(req.user.school_id, req.query.id).then(function(){
        req.flash("msg","Xoá loại chứng chỉ thành công!");
        res.redirect('/school/cert/certkind');
      })
    }catch(err){
      console.log(err);
      req.flash("msg","Xoá loại chứng chỉ thất bại!");
      res.redirect('/school/cert/certkind');
    }
  }
})
module.exports =  router;