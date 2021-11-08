const express = require("express");
const router = express.Router();
const certificateModel = require('../../models/certificateModel.js')

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
let uptoblockchain = (hash, student_address) => {
  
}
router.get('/',async (req, res)=> {
  res.render('./issuer/',{page:'', title:'trang chủ'});
});
// Quan ly chung chi -------------------------------------------
router.get('/cert', async (req, res)=> {
  var kindlist, namelist, cert_list;
  try{  
    await certificateModel.select_byissuer(req.user.issuer_id).then(function(data){
      return cert_list = data ;
    })
  }catch(err){
    console.log(err);
    res.redirect('back')
  }
  try{
    await certificateModel.certkind_getbyschool(req.user.school_id).then(function(data){
      return kindlist = data;
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
  res.render('./issuer/cert/',{page:'Cert', title:'Danh sách chứng chỉ', namelist, kindlist, cert_list})
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
  res.render('./issuer/cert/createByExcel',{page:'Cert', title:'Chứng chỉ', namelist, kindlist});
})
router.post("/cert/create-by-excel", async (req, res) => {
  var error = [];
  var cert_list = JSON.parse(req.body.cert_list);
  cert_list.forEach(function(elt){
    var fname = "cert_" + elt.number + ".json";
    QRCode.toFile('public//qrCode/cert_'+ elt.number +'.png', 'http://localhost:3000/cert-detail?data='+hashed_data, function (err) {
      if (err) throw err
    })
    elt.cert_name = req.body.cert_name
    elt.cert_kind = req.body.cert_kind
    var cert = {
      number: elt.number,
      cn_id: req.body.cn_id,
      ck_id: req.body.ck_id,
      student_email: elt.student_email,
      issuer_id: req.user.issuer_id,
      status: "checking",
    };
    // Tạo file
    fs.writeFile(
      "./public/cert/" + fname,
      JSON.stringify(elt),
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
  return res.status(200).send({result: 'redirect', url:'/issuer/cert'})
});
router.get('/cert/create',async (req, res) => {
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
  res.render('./issuer/cert/createByForm',{page:'Cert', title:'Chứng chỉ', namelist, kindlist});
})
router.post("/cert/create", async (req, res) => {
  
  var data = {
    number: req.body.number.toUpperCase().trim(),
    certname: req.body.certname.toUpperCase().trim(),
    certkind: req.body.certkind.toUpperCase().trim(),
    student_name: req.body.student_name.toUpperCase().trim(),
    student_gender: req.body.student_gender.toUpperCase().trim(),
    student_dayofbirth: req.body.student_dayofbirth.toUpperCase().trim(),
    student_placeofbirth: req.body.student_placeofbirth.toUpperCase().trim(),
    course_name: req.body.course_name.toUpperCase().trim(),
    duration: req.body.duration.toUpperCase().trim(),
    testday: req.body.testday.trim(),
    classification: req.body.classification.toUpperCase().trim(),
    signday: req.body.signday.trim(),
    regno: req.body.regno.toUpperCase().trim(),
  }
  var hashed_data = CryptoJS.SHA256(Object.toString(data), {asBytes: true});
  console.log(hashed_data);
  console.log(hashed_data.toString(CryptoJS.enc.Hex));
  var fname = "cert_" + data.number +".json";
  QRCode.toFile('public/'+ fname +'.png', 'http://localhost:3000/cert-detail?hash=?'+hashed_data, function (err) {
    if (err) throw err
    console.log('done')
  })
  // Tạo file
  var cert = {
    number: req.body.number,
    cn_id: req.body.cn_id,
    ck_id: req.body.ck_id,
    issuer_id: req.user.issuer_id,
    status: "checking",
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
          res.redirect("/issuer/cert");
        } catch (err) {
          console.log(err);
          res.redirect("/issuer/cert/create");
        }
      }
    }
  );
});
router.get('/cert/detail', async(req, res)=>{
  if (typeof req.query.number == ''){
    req.flash('error','Không tìm thấy chứng chỉ');
    res.redirect('back');
  }else {
    var data = fs.readFileSync('./public/cert/cert_' + req.query.number+'.json')
    var cert_info = JSON.parse(data);
    if(!cert_info){
      var url = 'https://ipfs.io/ipfs/' + data[0].ipfs_hash;
      request(
        {
          url: url,
          json: true,
        },
        function (error, response, data) {
          if (!error && response.statusCode === 200) {
            return cert_info = data;
          }
        }
      );
    } 
    res.render('./issuer/cert/detail',{title:"Chi tiết chứng chỉ",page:"Certificate" ,cert_info});
  }
})

module.exports = router;