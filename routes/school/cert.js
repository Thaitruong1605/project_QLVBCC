const express = require("express");
const router = express.Router();
const certificateModel = require("../../models/certificateModel");
const moment = require("moment");
const fs = require("fs"); // file system
const request = require("request"); 
const CryptoJS = require('crypto-js');
const ipfsClient = require("ipfs-http-client");
// const accountModel = require("../../models/accountModel");
// const hash = require('object-hash'); 
// const { Certificate } = require("crypto");

const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;

const Web3 = require ('web3');
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
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
router.post('/detail', async(req, res)=>{
  var cert_info = "";
  try {
    var data = fs.readFileSync('./public/cert/cert_' + req.body.number+'.json')
    cert_info = JSON.parse(data);
    return res.json({cert_info});
  }catch {
    try {
      await certificateModel.get_ipfs_hash(req.body.number).then(function(data){
        var ipfs= data;
        var url = 'https://ipfs.io/ipfs/' + ipfs;
        request(
          {
            url: url,
            json: true,
          },
          function (error, response, data) {
            if (!error && response.statusCode === 200) {
              cert_info = data;
              return res.json({cert_info});
            }
          }
        );
      })
    }catch(err){
      console.log(err);
    }
  }
})
// CHỨNG CHỈ ------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  var kindlist, namelist, certlist, kindList;
  try { await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindList = data;
    })
  }catch(err){ console.log(err); }
  
  try{ await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist= data;
    });
  }catch(err){ console.log(err); return res.redirect('/school'); }

  try{ await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist= data;
    });
  }catch(err){  console.log(err); return res.redirect('/school');  }
  
  try { await certificateModel.select_byschool(req.user.school_id).then(function (data) {
      return certlist= data;
    });
  } catch (err) { console.log(err); return res.redirect('/school'); }

  
  return res.render("./school/cert/", {page:'Certificate', title:'Danh sách chứng chỉ', kindlist, namelist, certlist, moment ,kindList});
});
router.get("/issue", async (req, res) => {
  if(typeof req.query.number == 'undefined '){
    req.flash("error","Phát hành chứng chỉ thất bại!");
    return res.redirect("/school/cert");
  } 
  var user_idNumber = req.query.user_idNumber;
  // I. Create system Instance
  const systemInstance = await SystemContract.deployed();
// II. Get user contract address
  var userCA = await systemInstance.getContractbyIDNumber(user_idNumber);
  if (userCA == '0x0000000000000000000000000000000000000000'){
    try{
      console.log("await systemInstance.createUserContractWithIDNumber(user_idNumber, systemInstance.address ,{from: process.env.SYSTEM_ADDRESS });");
      await systemInstance.createUserContractWithIDNumber(user_idNumber, systemInstance.address ,{from: process.env.SYSTEM_ADDRESS });
    }catch(err){
      console.log(err);
    }
    userCA = await systemInstance.getContractbyIDNumber(user_idNumber);
  }

  // III. Add cert to user's contracts
    // 1. Create school Instance
    var SchoolContract = contract(JSON.parse(fs.readFileSync('./src/abis/School.json')));
    SchoolContract.setProvider(provider); // set provider.
    var schCA = await systemInstance.getSchoolContractAddr(req.user.account_address);
    var schI = await SchoolContract.at(schCA);

    // 2. Hash cert_json
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

    // 5. push certhash to blockchain. 
    try {
      await schI.addCertificate('0x'+hashed_data, req.query.number, ipfs_hash, userCA, {from: req.user.account_address});
    }catch (err){
      console.log(err);
    }

    // 6. Update cert_info in database.
    try {
      await certificateModel.update_ipfs_hash(req.query.number, ipfs_hash);
      fs.unlink(path,(err=>{if(err) console.log(err);}));
      req.flash('msg','Cấp phát chứng chỉ thành công!');
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
router.get('/deactivate', async (req, res) => {
  if(typeof req.query.number == 'undefined'){
    req.flash("error","Phát hành chứng chỉ thất bại!");
    return res.redirect("/school/cert");
  } 
  let number = req.query.number;
  
  const sysI = await SystemContract.deployed();
  // I. Create school intance 
  const schAddr = req.user.account_address ;
  const schCA = await sysI.getSchoolContractAddr(schAddr);
 
  var schI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/School.json'))['abi'], schCA);
  // II. list transactions 
  var data = await schI.getPastEvents('allEvents',{
    fromBlock: 0
  },async function(error, event){ 
    if(error) console.log(error);
    return event;
  })
  
  let certHash, userCAddr;
  data.forEach(function(row){
    if(row.returnValues._certNumber == number){
      return certHash = row.returnValues._certHash, userCAddr=  row.returnValues._userCAddr;
    }
  })
  // console.log({certHash, userCAddr});
  try {
    await schI.methods.deactivateCertificate(certHash, number, userCAddr).send({from: req.user.account_address});
  }catch (err) {console.log(err); return }
  try {
    await certificateModel.update(number, {status: 'deactivate'})
  }catch (err) {console.log(err); return }
  req.flash("msg",`Thu hồi chứng chỉ "${number}" thành công`);
  return res.redirect("/school/cert");
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
  return res.render('./school/cert/certname',{page:'Certname',title:'Danh sách loại chứng chỉ',kind_list, name_list})
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