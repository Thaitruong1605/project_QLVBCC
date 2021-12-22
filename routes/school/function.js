const express = require("express");
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const Web3 = require ('web3');
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const certificateModel = require('../../models/certificateModel');
const issuerModel = require('../../models/issuerModel');
const accountModel = require('../../models/accountModel');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

// var SchoolContract = contract(JSON.parse(fs.readFileSync('./src/abis/School.json')));
// SchoolContract.setProvider(provider);

router.use("/cert", require('./cert'));
router.use("/issuer", require('./issuer'));

router.get("/", async (req, res) => {
  var certNumber, countList = {};
  const sysI = await SystemContract.deployed();
  // I. Create school intance 
  const schAddr = req.user.account_address ;
  const schCA = await sysI.getSchoolContractAddr(schAddr);
  var schI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/School.json'))['abi'], schCA);
  var schoolInfo = await schI.methods.getSchool().call({form:req.user.account_address});
  console.log(schoolInfo);
  // II. list transactions 
  var data = await schI.getPastEvents('allEvents',{
    fromBlock: 0
  },async function(error, event){ 
    if(error) console.log(error);
    return event;
  })
  var transactionList = []

  for (i= Object.keys(data).length-1; i>= 0; i-- ){
    transactionList.push({
      transactionHash: data[i].transactionHash,
      address: data[i].address,
      event: data[i].event,
      blockNumber: data[i].blockNumber,
      timestamp: moment.unix((await web3.eth.getBlock(data[i].blockNumber)).timestamp).format("DD/MM/YYYY, hh:mm:ss a")
    })
    if (data[i].event == "addedCertificate") {
      transactionList[transactionList.length-1].event = `addedCertificate(${data[i].returnValues._certNumber})`
    }
  }
  try {
    await certificateModel.count_groupByIssuer(req.user.school_id).then(function(data){
      data.forEach(function(elt){
        if (!countList[`${elt['account_username']}`]){
          countList[`${elt['account_username']}`] = {}
        }
        countList[`${elt['account_username']}`][`${elt['ck_name']}`] = elt['number'];
      })
    })
  }catch(err){
    console.log(err);
  }
  
  try{
    await certificateModel.countall(req.user.school_id).then(function(data){
      return certNumber = data;
    })
  }catch(err){
    console.log(err)
  }
  return res.render("./school",{title:"Dashboard", page:"Dashboard", certNumber, schoolInfo, countList, transactionList});
});
router.get("/dashboard", (req,res)=> {
  res.redirect('/school/');
})
router.get("/doi-mat-khau", async(req, res) => {
  return res.render("./school/doi-mat-khau",{title:"Đổi mật khẩu", page:"doi-mat-khau"});
})
router.post ("/doi-mat-khau", async(req, res) => {
  try{  
    await accountModel.get_password(req.user.account_username).then(async function(data){
      if (!bcrypt.compareSync(req.body.old_password,data)){
        req.flash("error","Mật khẩu không đúng!");
      }else {
        if (req.body.new_password != req.body.new_repassword){
          req.flash("error","Mật khẩu không giống!");
        } else {
          try{
            await accountModel.update({"account_password":bcrypt.hashSync(req.body.new_password,saltRounds)},req.user.account_username)
            req.flash("msg","Mật khẩu cập nhật thành công!");
        }catch(err){
            console.log(err);
          }
        }
      }
    })
  }catch(err){
    console.log(err);
  }
  res.redirect('/school/doi-mat-khau');
})
module.exports = router;
