const express = require("express");
const router = express.Router();
const certificateModel = require("../../models/certificateModel");
const moment = require("moment");

const fs = require("fs"); // file system
const request = require("request"); 
const hash = require('object-hash'); 
const CryptoJS = require('crypto-js');
const excel = require('excel');
const ipfsClient = require("ipfs-http-client");
const { Certificate } = require("crypto");

const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;

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

router.get("/", (req, res) => {
  try {
    certificateModel.select_byissuer("ISR0001").then(function (data) {
      res.render("./issuer/certificate/", {page:'Certificate', title:'Danh sách chứng chỉ', cert_list: data, moment });
    });
  } catch (err) {
    console.log(err);
    req.flash("error", err)
    res.redirect("back");
  }
});
router.get("/create", (req, res) => {
  res.render("./issuer/certificate/create",{title:'Nhập chứng chỉ', page:'Certificate'});
});
router.get("/update", (req, res) => {
  var number = req.query.number;
  res.render("./issuer/certificate/update");
});

router.get("/detail", (req, res) => {
  // lay du lieu
  try {
    certificateModel.select_byNumber(req.query.number).then(async function (data) {
      var filename = data[0].filename;
      if (filename != null) {
        data = JSON.parse(fs.readFileSync("./public/cert/" + filename));
        console.log(data);
        res.render('./issuer/certificate/detail',{cert_info: data});
      } else {
        var url = "https://ipfs.io/ipfs/" + data[0].ipfs_hash;
        request(
          {
            url: url,
            json: true,
          },
          function (error, response, data) {
            if (!error && response.statusCode === 200) {
              console.log(data);
              res.render('./issuer/certificate/detail',{cert_info: data});
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
              res.redirect("/issuer/certificate/");
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
        res.redirect("/issuer/certificate");
      });
  } catch (err) {
    console.log(err);
  }
});
router.post("/input-from-excel", async (req, res) => {
  qs                                      
})
router.post("/create", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var hashed_data = CryptoJS.SHA256(Object.toString(data), {asBytes: true});
  console.log(hashed_data);
  console.log(hashed_data.toString(CryptoJS.enc.Hex));
 

  
  // var fname = "cert_" + data.number + "_" + Date.now() + ".json";
  // // Tạo file - them vao CSDL - put ipfs
  // var cert = {
  //   number: data.number,
  //   issuer_id: "ISR0001",
  //   filename: fname,
  //   status: "Đang kiểm tra",
  //   hash: hashed_data
  // };

  // fs.appendFile(
  //   "./public/cert/" + fname,
  //   JSON.stringify(data),
  //   async function (err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.redirect("/issuer/certificate");
  //       try {
  //         certificateModel.insert(cert);
  //         res.redirect("/issuer/certificate");
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }
  // );
  // try {
  // } catch (err) {
  //   console.log(err);
  // }
});

// 2. Tên chứng chỉ
router.get('/certname', (req, res) => {
  try{
    certificateModel.certname_get().then(function(data) {
      res.render('./issuer/certificate/certname',{page:'Certificate',title:'Danh sách tên chứng chỉ',data})
    })
  }catch(err){
    console.log(err);
    res.redirect('/issuer/certificate/certname');
  }
})
router.post('/certname/create', async (req, res) => {
  if(req.body.cn_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/issuer/certificate/certname');
  }else {
    try{
      await certificateModel.certname_create(req.body.cn_name, req.user.issuer_id);
      req.flash("msg","Thêm mới tên chứng chỉ thành công!");
      res.redirect('/issuer/certificate/certname');
    }catch(err){
      console.log(err);
      res.redirect('/issuer/certificate/certname');
    }
  }
})
router.post('/certname/update', (req, res) => {
  try{
    certificateModel.certname_update(req.body.cn_id,req.body.cn_name).then(function(){
      req.flash('msg',"Cập nhập tên chứng chỉ thành công!");
      res.redirect('/issuer/certificate/certname');
    })
  }catch(err){
    console.log(err);
    res.redirect('/issuer/certificate/certname');
  }
})
// 3. Loại chứng chỉ

router.get('/certkind', async (req, res) => {
  try{
    certificateModel.certkind_get(null,req.user.issuer_id).then(function(data) {
      res.render('./issuer/certificate/certkind',{page:'Certificate',title:'Danh sách loại chứng chỉ',data})
    })
  }catch(err){
    console.log(err);
    res.redirect('back');
  }
})
router.post('/certkind/create', async (req, res) => {
  if(req.body.ck_name == ''){
    req.flash("alert","Vui lòng nhập tên chứng chỉ");
    res.redirect('/issuer/certificate/certkind');
  }else {
    try{
      await certificateModel.certkind_create(req.body.ck_name, req.user.issuer_id);
      req.flash("msg","Thêm mới tên chứng chỉ thành công!");
      res.redirect('/issuer/certificate/certkind');
    }catch(err){
      console.log(err);
      res.redirect('/issuer/certificate/certkind');
    }
  }
})
router.post('/certkind/update', (req, res) => {
  try{
    certificateModel.certkind_update(req.body.ck_id,req.body.ck_name).then(function(){
      req.flash('msg',"Cập nhập tên chứng chỉ thành công!");
      res.redirect('/issuer/certificate/certkind');
    })
  }catch(err){
    console.log(err);
    res.redirect('/issuer/certificate/certkind');
  }
})
module.exports =  router;