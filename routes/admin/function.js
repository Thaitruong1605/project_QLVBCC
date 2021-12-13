const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');

const accountModel = require('../../models/accountModel');
const certificateModel = require('../../models/certificateModel');

const contract = require('@truffle/contract');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.use('/school', require('./school'));
router.use('/user', require('./user'));
router.use('/account', require('./account'));

router.get('/', async (req, res) => {
  let account_number, cert_number, eventList;
  var sysI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/System.json'))['abi'], "0x0176aABd5df10420f68e4ADA22D9E7bD37A3f9a1");
  // II. list transactions 
  // let addedUser_trans = [];
  var data = await sysI.getPastEvents('allEvents',{
    fromBlock: '0',
    toBlock: 'latest'
  },async function(error, event){ 
    if(error) console.log(error);
    return  event
  })  
  var transactionList = []
  console.log(Object.keys(data).length)
  for (i= Object.keys(data).length-2; i>= 0; i-- ){
    console.log(data[i].returnValues._certHash);
    transactionList.push({
      transactionHash: data[i].transactionHash,
      event: data[i].event,
      blockNumber: data[i].blockNumber,
      timestamp: moment.unix((await web3.eth.getBlock(data[i].blockNumber)).timestamp).format("DD/MM/YYYY, hh:mm:ss a")
    })
  }
  try { 
    await accountModel.number_school_user().then(function(data){
      return account_number = data
    })
  } catch (err) { console.log(err); return}
  
  try {
    await certificateModel.get_numberByType().then(function(data){
      return cert_number = data
    })
  } catch (err) { console.log(err); return}

  res.render('./admin',{title: 'Dashboard', page:'dashboard', account_number, cert_number,transactionList });
})
router.get('/dashboard', (req, res) => {
  res.redirect('/admin');
})
module.exports = router