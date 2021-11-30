const express = require("express");
const router = express.Router();
const certificateModel = require('../../models/certificateModel.js')
const moment = require('moment');
const fs = require("fs"); // file system
const request = require("request"); 
const hash = require('object-hash'); 
const CryptoJS = require('crypto-js');

const ipfsClient = require("ipfs-http-client");
const { Certificate } = require("crypto");

const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;

const QRCode = require('qrcode');

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

client.pin.add("QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn").then((res) => {
  // console.log(res)
});
router.get('/',async (req, res)=> {
  res.redirect('/issuer/dashboard');
});
router.get('/dashboard',async (req, res)=> {
  res.render('./issuer/', {title:"Dashboard", page:"dashboard"})
})
// Quan ly chung chi -------------------------------------------
router.get('/cert', async (req, res)=> {
  
  var kindlist, namelist, cert_list;
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist = data;
    })
  }catch(err){
    console.log(err);
    return res.redirect('back')
  }
  if (typeof req.query.status == 'undefined'){
    try{  
      await certificateModel.select_byissuer(req.user.issuer_id).then(function(data){
        return cert_list = data ;
      })
    }catch(err){
      console.log(err);
      return res.redirect('back')
    }
  }else {
    try{
      await certificateModel.select_recentlyCert(req.user.issuer_id).then(function(data){
        return cert_list = data;
      })
    }catch(err){
      console.log(err);
      return res.redirect('back')
    }
  }
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist =data;
    })
  }catch(err){
    console.log(err);
    return res.redirect('back')
  }
  res.render('./issuer/cert/certList',{page:'cert', title:'Danh sách chứng chỉ', namelist, kindlist, cert_list, moment})
})
// create-by-excel
router.get('/cert/create-by-excel',async (req, res) => {
  var kindlist, namelist;
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist =data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back')
  }
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist =data;
    })
  }catch(err){
    console.log(err);
    res.redirect('back')
  }
  res.render('./issuer/cert/createByExcel',{page:'create-by-excel', title:'Chứng chỉ', namelist, kindlist});
})
router.post("/cert/create-by-excel", async (req, res) => {
  var error = [];
  var cert_list = JSON.parse(req.body.cert_list);
  cert_list.forEach(async function(elt){
    var cert_info = {
      number: elt.number.trim(),
      cert_kind: req.body.cert_kind.trim(),
      cert_name: req.body.cert_name.trim(),
      classification: elt.classification.trim(),
      signday: elt.signday.trim(),
      regno: elt.regno.trim(),
      user_name: elt.user_name.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
      user_gender: elt.user_gender.trim(),
      user_dayofbirth: elt.user_dayofbirth.trim(),
      user_placeofbirth: elt.user_placeofbirth.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
      user_idNumber: elt.user_idNumber.trim(),
    }
    
    var hashed_data = await '0x'+CryptoJS.SHA256(JSON.stringify(cert_info));
    var fname = "cert_" + elt.number + ".json";
    console.log(elt.number+':'+ hashed_data);
    
    var cert = {
      number: elt.number.trim(),
      regno: elt.regno.trim(),
      cn_id: req.body.cn_id.trim(),
      ck_id: req.body.ck_id.trim(),
      issuer_id: req.user.issuer_id,
      hash: hashed_data,
      user_idNumber: elt.user_idNumber.trim(),
      user_name: elt.user_name.trim(),
      user_birth: moment(elt.user_dayofbirth.trim(),'DD/MM/YYYY').format(),
      status: "checking",
    };
    // Tạo file
    fs.writeFile(
      "./public/cert/" + fname,
      JSON.stringify(cert_info),
      async function (err) {
        if (err) {
          console.log(err);
        } else {
          try {
            await certificateModel.create(cert);
          } catch (err) {
            console.log(err);
            error.push('Thêm chứng chỉ số '+cert.number+' thất bại!');
          }
        }
      }
    );
  })
  if (error == ''){
    req.flash('msg','Tạo chứng chỉ mới thành công')
  }else {
    req.flash('error',error)
  }
  return res.status(200).send({result: 'redirect', url:'/issuer/cert', status: 'recently'})
});
router.get('/cert/create',async (req, res) => {
  var kindList, nameList;
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindList =data;
    })
  }catch(err){
    console.log(err);
  }
  try{
    await certificateModel.certname_getbyKindId(kindList[0].ck_id).then(function(data){
      return nameList =data;
    })
  }catch(err){
    console.log(err);
  }
  res.render('./issuer/cert/createByForm',{page:'create', title:'Thêm mới chứng chỉ', kindList, nameList});
})
router.post("/cert/create", async (req, res) => {
  var data = {
    number: req.body.number.trim(),
    cert_kind: req.body.cert_kind.trim(),
    cert_name: req.body.cert_name.trim(),
    classification: req.body.classification.trim(),
    signday: req.body.signday.trim(),
    regno: req.body.regno.trim(),
    user_name: req.body.user_name.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
    user_gender: (req.body.user_gender.trim() == 1)? "Nam":"Nữ",
    user_dayofbirth: req.body.user_dayofbirth.trim(),
    user_placeofbirth: req.body.user_placeofbirth.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
    user_idNumber: req.body.user_idNumber.trim(),
  }

  var hashed_data = await '0x'+CryptoJS.SHA256(JSON.stringify(data));
  console.log(req.body.number+':'+ hashed_data);

  var fname = "cert_" + data.number +".json";
  // // Tạo file
  var cert = {
    number: req.body.number.trim(),
    regno: req.body.regno.trim(),
    cn_id: req.body.cn_id.trim(),
    ck_id: req.body.ck_id.trim(),
    issuer_id: req.user.issuer_id,
    hash: hashed_data,
    user_idNumber: req.body.user_idNumber.trim(),
    user_name: req.body.user_name.trim(),
    user_birth: moment(req.body.user_dayofbirth.trim(),'DD/MM/YYYY').format(),
    status: "checking",
  };
  fs.writeFile(
    "./public/cert/" + fname,
    JSON.stringify(data),
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        // Thêm vào CSDL
        try {
          await certificateModel.create(cert);
          req.flash('msg','Thêm mới chứng chỉ thành công!')
          res.redirect("/issuer/cert");
        } catch (err) {
          console.log(err);
          res.redirect("/issuer/cert/create");
        }
      }
    }
  );
});
router.get("/cert/update", async (req,res )=> {
  if (typeof req.query.number == 'undefined'){
    return res.redirect("/issuer/cert");
  }
  var kindList, cert_info, nameList;
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindList =data;
    })
  }catch(err){
    console.log(err);
  }
  try{
    await certificateModel.select_byNumber(req.query.number).then(function(data){
      return cert_info = data;
    })
  }catch(err){
    console.log(err);
  }
  try{
    await certificateModel.certname_getbyKindId(cert_info.ck_id).then(function(data){
      return nameList = data;
    })
  }catch(err){
    console.log(err);
  }
  var cert_data = JSON.parse(await fs.readFileSync('./public/cert/cert_' + req.query.number+'.json'));
  res.render('./issuer/cert/update',{page:'update', title:'Cập nhật chứng chỉ', cert_data, cert_info , kindList, nameList});
})
router.post("/cert/update", async (req, res) => {
  var data = req.body;
  var data = {
    number: req.body.number.trim(),
    cert_kind: req.body.cert_kind.trim(),
    cert_name: req.body.cert_name.trim(),
    classification: req.body.classification.trim(),
    signday: req.body.signday.trim(),
    regno: req.body.regno.trim(),
    user_name: req.body.user_name.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
    user_gender: (req.body.user_gender.trim() == 1)? "Nam":"Nữ",
    user_dayofbirth: req.body.user_dayofbirth.trim(),
    user_placeofbirth: req.body.user_placeofbirth.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
    user_idNumber: req.body.user_idNumber.trim(),
  }

  var hashed_data = await '0x'+CryptoJS.SHA256(JSON.stringify(data));
  var fname = "cert_" + data.number +".json";
  // Tạo file
  var cert = {
    number: req.body.number.trim(),
    regno: req.body.regno.trim(),
    // cn_id: req.body.cn_id.trim(),
    // ck_id: req.body.ck_id.trim(),
    issuer_id: req.user.issuer_id,
    hash: hashed_data,
    user_idNumber: req.body.user_idNumber.trim(),
    user_name: req.body.user_name.trim(),
    user_birth: moment(req.body.user_dayofbirth.trim(),'DD/MM/YYYY').format(),
    status: "checking",
  };
  fs.writeFile(
    "./public/cert/" + fname,
    JSON.stringify(data),
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        // Thêm vào CSDL
        try {
          await certificateModel.update(req.body.number, cert);
          req.flash('msg','Cập nhật chứng chỉ thành công!')
          res.send ({result: "redirect",url:"/issuer/cert"});
        } catch (err) {
          console.log(err);
          res.send ({result: "redirect",url:"/issuer/cert"});
        }
      }
    }
  );
});
router.post('/cert/detail', async(req, res)=>{
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
router.post('/cert/delete', async(req, res)=>{
  try {
    await certificateModel.delete_byNumber(req.body.number);
    try{
      fs.unlink('./public/cert/cert_'+req.body.number+'.json');
    }catch(err){
      console.log(err);
    }
    req.flash('msg',`Xoá chứng chỉ "${req.body.number}" thành công`);
  }catch (err){
    console.log(err);
  }
  return res.status(200).send({result: 'redirect', url:'/issuer/cert'})
})
router.post('/cert/get-certname', async (req, res)=> {
  await certificateModel.certname_getbyKindId(req.body.ck_id).then(function(data){
    res.send({nameList:data});
  })
})
router.post('/check-cert-info',async (req, res)=> {
  var data = JSON.parse(req.body.data)
  var numberList, regnoList;
  numberList = JSON.stringify(data['numberList']).replace('[','(').replace(']',')').replace(/"/g,"'");
  regnoList = JSON.stringify(data['regnoList']).replace('[','(').replace(']',')').replace(/"/g,"'");
  try{
    await certificateModel.check_cert(numberList, regnoList).then(function(data){
      res.send(data)
    })
  }catch(err){  
    console.log(err);
  }
})
module.exports = router;