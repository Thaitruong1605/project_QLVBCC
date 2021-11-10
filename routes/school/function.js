const express = require("express");
const router = express.Router();
const fs = require('fs');

const Web3 = require ('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.use("/cert", require('./cert'));
router.use("/issuer", require('./issuer'));

router.get("/", (req, res) => {
  res.render("./school",{title:"Trang quản lý của trường học", page:"index"});
});
router.get('/transaction', async (req, res) => {
  const sysI = await SystemContract.deployed();
  var stuCA = await sysI.getContractbyEmail('thaitruong1605@gmail.com');
  var stuContract = contract(JSON.parse(fs.readFileSync('./src/abis/Student.json')));  
  stuContract.setProvider(provider);
  var stuI = await stuContract.at(stuCA);
  
  stuI.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}, async function(e,results){
    console.log(e);
    var transList = results;
    transList.forEach(async function(elt){
      block = await web3.eth.getBlock(transList[0].blockHash);
      // console.log(block.timestamp);
      var date = new Date(block.timestamp*1000);
      elt.time = moment(date).format('DD/MM/YYYY, h:mm:ss a');
    })
    console.log('transList');
    // res.render('./admin/functions/transaction',{title: 'Giao dịch', page:'Transaction', transList})
  })
})
module.exports = router;
