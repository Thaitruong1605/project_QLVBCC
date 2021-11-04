const express = require("express");
const router = express.Router();
const certificateModel = require("../../models/certificateModel");
const moment = require("moment");
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
    var data = await fs.readFileSync('./public/cert/cert_' + req.query.number+'.json')
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
  if(typeof req.query.number != 'undefined '){
    var path= './public/cert/cert_' + req.query.number +'.json';
    const file = await client.add(
      ipfsClient.globSource(path)
    );
    var ipfs_hash = file.cid.toString();
    // Cập nhật thông tin chứng chỉ
    try {
      await certificateModel.update_ipfs_hash(req.query.number, ipfs_hash);
      fs.unlink(path,(err=>{if(err) console.log(err);}));
      req.flash('msg','Đã tải chứng chỉ lên ipfs!');
      res.redirect('/school/cert');
    } catch (err) {
      console.log(err);
    }
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
router.get('/certname', (req, res) => {
  try{
    certificateModel.certname_get().then(function(data) {
      res.render('./school/cert/certname',{page:'Certificate',title:'Danh sách tên chứng chỉ',data})
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/cert/certname');
  }
})
router.post('/certname/create', async (req, res) => {
  if(req.body.cn_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/school/cert/certname');
  }else {
    try{
      await certificateModel.certname_create(req.body.cn_name, req.user.school_id);
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