const express = require("express");
const passport = require("passport");
const router = express.Router();
const fs = require("fs");
const moment = require("moment");
const certModel = require("../../models/certificateModel");

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
  res.render("./issuer");
});
router.get("/certificate/create", (req, res) => {
  res.render("./issuer/certificate/create");
});
router.get("/certificate", (req, res) => {
  try {
    certModel.select_byissuer("ISR0001").then(function (data) {
      res.render("./issuer/certificate/", { cert_list: data, moment });
    });
  } catch (err) {
    console.log(err);
    // res.redirect("/issuer");
  }
});
router.get("/certificate/edit", (req, res) => {
  res.render("./issuer/certificate/edit");
});

router.get("/certificate/detail", (req, res) => {
  // lay du lieu
  let cert_info;
  try {
    certModel.select_byNumber(req.query.number).then(async function (data) {
      var filename = data[0].filename;
      if (filename != null ){
        var file  = fs.readFileSync('./public/cert/'+filename);
        cert_info = JSON.parse(file);
      }else{
        
      }
    });
  } catch (err) {
    console.log(err);
  }
});
//
router.get("/certificate/delete", async (req, res) => {
  // lay ten file
  try {
    certModel.select_byNumber(req.query.number).then(function (data) {
      var cert = data[0];
      if (cert.ipfs_hash == null) {
        fs.unlink("./public/cert/" + cert.filename, (err) => {
          // xoa file
          // Xoá thông tin trong csdl
          if (err) console.log(err);
          else {
            try {
              certModel.delete_byNumber(req.query.number);
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
router.get("/certificate/up_to_ipfs", async (req, res) => {
  // lấy file
  try {
    filename = certModel
      .select_byNumber(req.query.number)
      .then(async function (data) {
        var filename = data[0].filename;
        const file = await client.add(
          ipfsClient.globSource("./public/cert/" + filename)
        );
        var ipfs_hash = file.cid.toString();
        // luu vao csdl
        try {
          await certModel.update_ipfs_hash(req.query.number, ipfs_hash);
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

router.post("/certificate/create", async (req, res) => {
  var data = req.body;
  var fname = "cert_" + data.number + "_" + Date.now() + ".json";
  // Tạo file - them vao CSDL - put ipfs
  var cert = {
    number: data.number,
    issuer_id: "ISR0001",
    filename: fname,
    status: "Đang kiểm tra",
  };

  fs.appendFile(
    "./public/cert/" + fname,
    JSON.stringify(data),
    async function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/issuer/certificate");
        try {
          certModel.insert(cert);
          res.redirect("/issuer/certificate");
        } catch (err) {
          console.log(err);
        }
      }
    }
  );
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
