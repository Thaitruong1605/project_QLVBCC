const express = require("express");
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const Web3 = require ('web3');
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

const certificateModel = require('../../models/certificateModel');
const issuerModel = require('../../models/issuerModel');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

// var SchoolContract = contract(JSON.parse(fs.readFileSync('./src/abis/School.json')));
// SchoolContract.setProvider(provider);

router.use("/cert", require('./cert'));
router.use("/issuer", require('./issuer'));

router.get("/", async (req, res) => {
  var certNumber, issuerNumber, countList = {};
  const sysI = await SystemContract.deployed();
  // I. Create school intance 
  const schAddr = "0x70cE91A72dbE08aaD8766aE09E977d559C13B806"; // test
  const schCA = await sysI.getSchoolContractAddr(schAddr);
  var schI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/School.json'))['abi'], schCA);
  // II. list transactions 
  var data = await schI.getPastEvents('allEvents',{
    fromBlock: 0, toBlock: 'latest'
  },async function(error, event){ 
    if(error) console.log(error);
    return event;
  })
  var transactionList = []
  console.log(Object.keys(data).length)
  for (i= Object.keys(data).length-2; i>= 0; i-- ){
    transactionList.push({
      transactionHash: data[i].transactionHash,
      address: data[i].address,
      event: data[i].event,
      blockNumber: data[i].blockNumber,
      timestamp: moment.unix((await web3.eth.getBlock(data[i].blockNumber)).timestamp).format("DD/MM/YYYY, hh:mm:ss a")
    })
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
    await issuerModel.countAll(req.user.school_id).then(function(data){
      console.log(data)
      return issuerNumber = data;
    })
  }catch(err){
    console.log(err)
  }
  try{
    await certificateModel.countall(req.user.school_id).then(function(data){
      return certNumber = data;
    })
  }catch(err){
    console.log(err)
  }
  return res.render("./school",{title:"Dashboard", page:"Dashboard", certNumber, issuerNumber, countList, transactionList});
});
router.get("/dashboard", (req,res)=> {
  res.redirect('/school/');
})
module.exports = router;
