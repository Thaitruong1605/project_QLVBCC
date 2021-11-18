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
  // console.log(res)
});

// CHỨNG CHỈ ------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  var kindlist, namelist, certlist;
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist= data;
    });
  }catch(err){
    console.log(err);
    return res.redirect('/school');
  }
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist= data;
    });
  }catch(err){
    console.log(err);
    return res.redirect('/school');
  }
  try {
    await certificateModel.select_byschool(req.user.school_id).then(function (data) {
      return certlist= data;
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/school');
  }
  if (kindlist !='' && namelist !=''){
    res.render("./school/cert/", {page:'Certificate', title:'Danh sách chứng chỉ', kindlist, namelist, certlist, moment });
  }else {
    req.flash('err','Không thể truy cập');
    res.redirect('/school');
  }
});
router.get("/create",async (req, res) => {
  var kindlist, namelist;
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist= data;
    });
  }catch(err){
    console.log(err);
    res.redirect("back");
  }
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist= data;
    });
  }catch(err){
    console.log(err);
    res.redirect("back");
  }
  res.render("./school/cert/create",{title:'Nhập chứng chỉ',namelist, kindlist , page:'Certificate'});
});
router.get("/update",async (req, res) => {
  // lay du lieu
  var kindlist, namelist;
  try{
    await certificateModel.certname_getbyschool(req.user.school_id).then(function(data){
      return namelist= data;
    });
  }catch(err){
    console.log(err);
    res.redirect("back");
  }
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist= data;
    });
  }catch(err){
    console.log(err);
    res.redirect("back");
  }
  // 
  try {
    certificateModel.select_byNumber(req.query.number).then(async function (data) {
      var filename = data[0].filename;
     
        data = JSON.parse(fs.readFileSync("./public/cert/" + filename));
        res.render('./school/cert/update',{title:"Cập nhật chứng chỉ",page:"Certificate" ,cert_info: data,kindlist,namelist});
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/detail", async (req, res) => {
  if (typeof req.query.number == ''){
    req.flash('error','Không tìm thấy chứng chỉ');
    res.redirect('back');
  }else {
    try {
      var data = await fs.readFileSync('./public/cert/cert_' + req.query.number+'.json');
      var cert_info = JSON.parse(data);
      res.render('./school/cert/detail',{title:"Chi tiết chứng chỉ",page:"Cert" ,cert_info});
    }catch(err){
      ipfs_hash = await certificateModel.get_ipfs_hash(req.query.number);
      var url = 'https://ipfs.io/ipfs/' + ipfs_hash;
      request(
        {
          url: url,
          json: true,
        },
        function (error, response, data) {
          if (!error && response.statusCode === 200) {
            cert_info = data;
            res.render('./school/cert/detail',{title:"Chi tiết chứng chỉ",page:"Cert" ,cert_info});
          }
        }
      );
    }
  }
});
router.get("/delete", async (req, res) => {
  // lay ten file
  try {
    certificateModel.select_byNumber(req.query.number).then(function (data) {
      var cert = data[0];
      if (cert.ipfs_hash == null) {
        fs.unlink("./public/cert/" + cert.filename, (err) => {
          // xoa file
          // Xoá thông tin trong csdl
          if (err) console.log(err);
          else {
            try {
              certificateModel.delete_byNumber(req.query.number);
              res.redirect("/school/cert/");
            } catch (err) {
              console.log(err);
            }
          }
        });
      } else {
        console.log("File đã được up lên ipfs");
      }
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/issue", async (req, res) => {
  if(typeof req.query.number == 'undefined ') return;
  // create system Instance
    const systemInstance = await SystemContract.deployed();
  // get user contract 
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
    // push cert to blockchain
      // create user Instance
    var StudentContract = contract(JSON.parse(fs.readFileSync('./src/abis/Student.json')));
    StudentContract.setProvider(provider);
    var stuI = await StudentContract.at(stuCA);
    //   // up to ifps
    var path= './public/cert/cert_' + req.query.number +'.json';
    var hashed_data = CryptoJS.SHA256(JSON.stringify(JSON.parse(fs.readFileSync(path))));
    QRCode.toFile('./public/qrCode/cert_'+ req.query.number +'.png', 'http://localhost:3000/cert-detail?data=0x'+hashed_data, function (err) {
      if (err) throw err
    })
    console.log('hashed_data: 0x'+hashed_data);
    const file = await client.add(
      ipfsClient.globSource(path)
    );
    var ipfs_hash = file.cid.toString();
    try {
      await stuI.addCertificate('0x'+hashed_data,{from: req.user.account_address});
      // update info in database
      try {
        await certificateModel.update_ipfs_hash(req.query.number, ipfs_hash);
        // Xoa file tren server
        fs.unlink(path,(err=>{if(err) console.log(err);}));
        req.flash('msg','Cáp phát chứng chỉ thành công!');
        res.redirect('/school/cert');
      } catch (err) {
        console.log(err);
      }
    }catch (err){
      console.log(err);
    }
});
router.get('/set-to-incorrect', async(req, res )=> {
  if (typeof req.query.number == 'undefined'){
    req.flash('error','Không tìm thấy thông tin');
    res.redirect('back');
  }else {
    var cert = {
      status: 'Incorrect'
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

// 2. Tên chứng chỉ
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
    return res.render('./school/cert/certname',{page:'Certificate',title:'Danh sách tên chứng chỉ',kind_list, name_list})
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
router.get('/certname/remove', (req, res )=> {
  if (typeof req.query.id != 'undefined'){
    try{
      certificateModel.certname_remove(req.user.school_id, req.query.id).then(function(){
        req.flash("msg","Xoá tên chứng chỉ thành công!");
        res.redirect('/school/cert/certname');
      })
    }catch(err){
      console.log(err);
      req.flash("msg","Xoá tên chứng chỉ thất bại!");
      res.redirect('/school/cert/certname');
    }
  }
})
// 3. Loại chứng chỉ

router.get('/certkind', async (req, res) => {
  try{
    certificateModel.certkind_getbyschool(req.user.school_id).then(function(data) {
      res.render('./school/cert/certkind',{page:'Certificate',title:'Danh sách loại chứng chỉ',data})
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
    certificateModel.certkind_update(req.body.ck_id,req.body.ck_name).then(function(){
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