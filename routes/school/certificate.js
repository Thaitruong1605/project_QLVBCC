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
  try {
    await certificateModel.select_byschool(req.user.school_id).then(function (data) {
      return certlist= data;
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
  if (kindlist !='' && namelist !=''){
    res.render("./school/certificate/", {page:'Certificate', title:'Danh sách chứng chỉ', kindlist, namelist, certlist, moment });
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
  res.render("./school/certificate/create",{title:'Nhập chứng chỉ',namelist, kindlist , page:'Certificate'});
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
        res.render('./school/certificate/update',{title:"Cập nhật chứng chỉ",page:"Certificate" ,cert_info: data,kindlist,namelist});
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/detail", (req, res) => {
  // lay du lieu
  try {
    certificateModel.select_byNumber(req.query.number).then(async function (data) {
      var filename = data[0].filename;
      if (filename != null) {
        data = JSON.parse(fs.readFileSync("./public/cert/" + filename));
        res.render('./school/certificate/detail',{title:"Chi tiết chứng chỉ",page:"Certificate" ,cert_info: data});
      } else {
        var url = "https://ipfs.io/ipfs/" + data[0].ipfs_hash;
        request(
          {
            url: url,
            json: true,
          },
          function (error, response, data) {
            if (!error && response.statusCode === 200) {
              res.render('./school/certificate/detail',{cert_info: data});
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
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
              res.redirect("/school/certificate/");
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
router.get("/up_to_ipfs", async (req, res) => {
  if(typeof req.query.number != 'undefined '){
    // lấy file
    try {
      filename = certificateModel
        .select_byNumber(req.query.number)
        .then(async function (data) {
          var filename = data[0].filename;
          const file = await client.add(
            ipfsClient.globSource("./public/cert/" + filename)
          );
          var ipfs_hash = file.cid.toString();
          // luu vao csdl
          try {
            await certificateModel.update_ipfs_hash(req.query.number, ipfs_hash);
          } catch (err) {
            console.log(err);
          }
          // res.flash(msg,"Đã tải chứng chỉ lên ipfs!");
          res.redirect("/school/certificate");
        });
    } catch (err) {
      console.log(err);
    }
  }else {
    console.log("Không tin thấy number")
  }
});
router.post("/create", async (req, res) => {
  var data = {
    number: req.body.number,
    certname: req.body.certname,
    certkind: req.body.certkind,
    student_name: req.body.student_name,
    student_gender: req.body.student_gender,
    student_dayofbirth: req.body.student_dayofbirth,
    student_placeofbirth: req.body.student_placeofbirth,
    course_name: req.body.course_name,
    duration: req.body.duration,
    testday: req.body.testday,
    classification: req.body.classification,
    signday: req.body.signday,
    regno: req.body.regno,
  }
  var hashed_data = CryptoJS.SHA256(Object.toString(data), {asBytes: true});
  console.log(hashed_data);
  console.log(hashed_data.toString(CryptoJS.enc.Hex));
  var fname = "cert_" + data.number + "_" + Date.now() + ".json";
  QRCode.toFile('public/'+ fname +'.png', 'http://localhost:3000/cert-detail?hash=?'+hashed_data, function (err) {
    if (err) throw err
    console.log('done')
  })
  // Tạo file
  var cert = {
    number: req.body.number,
    cn_id: req.body.cn_id,
    ck_id: req.body.ck_id,
    school_id: req.user.school_id,
    filename: fname,
    status: "CHECKING",
    hash: hashed_data
  };
  fs.appendFile(
    "./public/cert/" + fname,
    JSON.stringify(data),
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        // Thêm vào CSDL
        try {
          await certificateModel.create(cert);
          req.flash('msg','Tạo chứng chỉ mới thành công')
          res.redirect("/school/certificate");
        } catch (err) {
          console.log(err);
        }
      }
    }
  );

});
router.post("/update", async (req, res) => {
  var data = {
    number: req.body.number,
    certname: req.body.certname,
    certkind: req.body.certkind,
    student_name: req.body.student_name,
    student_gender: req.body.student_gender,
    student_dayofbirth: req.body.student_dayofbirth,
    student_placeofbirth: req.body.student_placeofbirth,
    course_name: req.body.course_name,
    duration: req.body.duration,
    testday: req.body.testday,
    classification: req.body.classification,
    signday: req.body.signday,
    regno: req.body.regno,
  }
  var hashed_data = CryptoJS.SHA256(Object.toString(data), {asBytes: true});
  console.log(hashed_data);
  console.log(hashed_data.toString(CryptoJS.enc.Hex));
  
  var fname = "cert_" + data.number + "_" + Date.now() + ".json";
  // Xoá file
  try {
    await certificateModel.select_byNumber(req.query.number).then(function (data) {
      var cert = data[0];
      if (cert.ipfs_hash == null) {
        fs.unlink("./public/cert/" + cert.filename, (err) => {
          if (err) console.log(err);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  // Tạo file
  var cert = {
    cn_id: req.body.cn_id,
    ck_id: req.body.ck_id,
    school_id: req.user.school_id,
    filename: fname,
    status: "CHECKING",
    hash: hashed_data
  };
  fs.appendFile(
    "./public/cert/" + fname,
    JSON.stringify(data),
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        // Thêm vào CSDL
        try {
          await certificateModel.update(req.body.number, req.user.school_id ,cert);
          req.flash('msg','Cập nhật chứng chỉ thành công')
          res.redirect("/school/certificate");
        } catch (err) {
          console.log(err);
        }
      }
    }
  );

});

// 2. Tên chứng chỉ
router.get('/certname', (req, res) => {
  try{
    certificateModel.certname_get().then(function(data) {
      res.render('./school/certificate/certname',{page:'Certificate',title:'Danh sách tên chứng chỉ',data})
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/certificate/certname');
  }
})
router.post('/certname/create', async (req, res) => {
  if(req.body.cn_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/school/certificate/certname');
  }else {
    try{
      await certificateModel.certname_create(req.body.cn_name, req.user.school_id);
      req.flash("msg","Thêm mới tên chứng chỉ thành công!");
      res.redirect('/school/certificate/certname');
    }catch(err){
      console.log(err);
      res.redirect('/school/certificate/certname');
    }
  }
})
router.post('/certname/update', (req, res) => {
  try{
    certificateModel.certname_update(req.body.cn_id,req.body.cn_name).then(function(){
      req.flash('msg',"Cập nhập tên chứng chỉ thành công!");
      res.redirect('/school/certificate/certname');
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/certificate/certname');
  }
})
router.get('/certname/remove', (req, res )=> {
  if (typeof req.query.id != 'undefined'){
    try{
      certificateModel.certname_remove(req.user.school_id, req.query.id).then(function(){
        req.flash("msg","Xoá tên chứng chỉ thành công!");
        res.redirect('/school/certificate/certname');
      })
    }catch(err){
      console.log(err);
      req.flash("msg","Xoá tên chứng chỉ thất bại!");
      res.redirect('/school/certificate/certname');
    }
  }
})
// 3. Loại chứng chỉ

router.get('/certkind', async (req, res) => {
  try{
    certificateModel.certkind_getbyschool(req.user.school_id).then(function(data) {
      res.render('./school/certificate/certkind',{page:'Certificate',title:'Danh sách loại chứng chỉ',data})
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
})
router.post('/certkind/create', async (req, res) => {
  if(req.body.ck_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/school/certificate/certkind');
  }else {
    try{
      await certificateModel.certkind_create(req.user.school_id, req.body.ck_name);
      req.flash("msg","Thêm mới loại chứng chỉ thành công!");
      res.redirect('/school/certificate/certkind');
    }catch(err){
      console.log(err);
      res.redirect('/school/certificate/certkind');
    }
  }
})
router.post('/certkind/update', (req, res) => {
  try{
    certificateModel.certkind_update(req.body.ck_id,req.body.ck_name).then(function(){
      req.flash('msg',"Cập nhập loại chứng chỉ thành công!");
      res.redirect('/school/certificate/certkind');
    })
  }catch(err){
    console.log(err);
    res.redirect('/school/certificate/certkind');
  }
})
router.get('/certkind/remove', (req, res )=> {
  if (typeof req.query.id != 'undefined'){
    try{
      certificateModel.certkind_remove(req.user.school_id, req.query.id).then(function(){
        req.flash("msg","Xoá loại chứng chỉ thành công!");
        res.redirect('/school/certificate/certkind');
      })
    }catch(err){
      console.log(err);
      req.flash("msg","Xoá loại chứng chỉ thất bại!");
      res.redirect('/school/certificate/certkind');
    }
  }
})
module.exports =  router;