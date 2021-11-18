const express = require('express');
const passport = require('passport');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const schoolModel = require('../../models/schoolModel');
const contract = require('@truffle/contract');
const bytes32 = require('bytes32');
const SHA256 = require('sha256');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3( provider );

const account = '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.use('/school', require('./school'));
router.use('/user', require('./user'));
router.use('/account', require('./account'));

let get_school = async () => {
  var school;
  try {
    var data = await schoolModel.school_selectbyId('ISR0001').then(function(data){
      return data[0];
    });
    school = {
      name: data.school_name, 
      addressPlace: data.school_address,
      phoneNumber: data.school_phone,
      email: data.school_email,
      fax: data.school_fax,
      website: data.school_website
    }
  }catch (err){
    console.log(err);
  }
  return school;
}
router.get('/', async (req, res) => {

  res.render('./admin',{title: 'Dashboard', page:''});
})
router.get('/create_user_contract', async (req,res) => {
  var stuAddr = '0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701'
  const StudentAtrifact = JSON.parse(fs.readFileSync('./src/abis/Student.json'));
  const StudentContract = contract(StudentAtrifact);
  StudentContract.setProvider(provider);

  const stInstane = await StudentContract.new({from: '0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701'});
  var iaddr = stInstane.address;
  console.log(iaddr);
  const systemInstance = await SystemContract.deployed();
  await systemInstance.addStudent(stuAddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
  await systemInstance.changeStudentContract(stuAddr,iaddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'} );
  // await systemInstance.addCerf(stuAddr,'0x70cE91A72dbE08aaD8766aE09E977d559C13B806', 'hash_value',{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
})
router.get('/add_cert' ,async(req, res) => {
  var stuAddr = '0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701';
  const systemInstance = await SystemContract.deployed();
  // var bytes32_val = bytes32({input: '019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10'});
  var bytes32_val = '0x019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10132761902bf4c3';
  console.log(bytes32_val);
  await systemInstance.addCerf(stuAddr,'0x70cE91A72dbE08aaD8766aE09E977d559C13B806',bytes32_val,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
})
router.get('/create_school_contract', async (req,res) => {
  // tao hop dong school 
  var schoolAddr = '0x70cE91A72dbE08aaD8766aE09E977d559C13B806';
  const IssuerAtrifact = JSON.parse(fs.readFileSync('./src/abis/Issuer.json'));
  const IssuerContract = contract(IssuerAtrifact);
  IssuerContract.setProvider(provider);
  
  var school = await get_school();
  console.log(school);
  
  const isrInstance = await IssuerContract.new(school.name, school.addressPlace, school.phoneNumber, school.email, school.fax, school.website,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
  // // await IssuerContract.transferOwnership(schoolAddr,{from: schoolAddr});
  // // const isrInstance = await IssuerContract.at('0x452c8C8Dc76C6D18F5bb18E2c79F04D010EFAAb2');
  // console.log(isrInstance.address);
  // const systemInstance = await SystemContract.deployed();
  // await systemInstance.addIssuer(schoolAddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'} );
  // await systemInstance.changeIssuerContract(schoolAddr,isrInstance.address ,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
  // var addr = await systemInstance.mapIssuer.call(schoolAddr);
  // res.send(addr);
})
router.get('/get_school_data', async(req, res)=> {
  // 0xfd3793bebf81E084AD71F1fbCdf1AA44D02FB2d7
  const IssuerAtrifact = JSON.parse(fs.readFileSync('./src/abis/Issuer.json'));
  const IssuerContract = contract(IssuerAtrifact);
  IssuerContract.setProvider(provider);
  var i = await IssuerContract.at('0x14736CBf4985c0518a841C41Cdb69486deeED1e3');
  console.log(i.address);
  var returndata = await i.getData();
  console.log(returndata);
})
router.get('/get_school_contract_address', async (req, res) => {
  const systemInstance = await SystemContract.deployed();
  var a = await systemInstance.mapIssuer.call('0x70cE91A72dbE08aaD8766aE09E977d559C13B806');
  console.log(a)
})

// transaction

router.get('/transaction', async (req, res) => {
  var myContract = new web3.eth.Contract([
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newIssuer",
          "type": "address"
        }
      ],
      "name": "addedIssuer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newStudent",
          "type": "address"
        }
      ],
      "name": "addedStudent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_issuerAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_contractAddr",
          "type": "address"
        }
      ],
      "name": "changedIssuerContract",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_userAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_contractAddr",
          "type": "address"
        }
      ],
      "name": "changedStudentContract",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "issuerAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "mapIssuer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "mapStudent",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuerAddr",
          "type": "address"
        }
      ],
      "name": "addIssuer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuerAddr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_contractAddr",
          "type": "address"
        }
      ],
      "name": "changeIssuerContract",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddr",
          "type": "address"
        }
      ],
      "name": "addStudent",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_contractAddr",
          "type": "address"
        }
      ],
      "name": "changeStudentContract",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_issuerAddress",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_hashedCert",
          "type": "bytes32"
        }
      ],
      "name": "addCerf",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],process.env.SYSTEM_ADDRESS)
  
  myContract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}, async function(e,results){
    var transList = results;
    // transList.forEach(async function(elt){
    //   block = await web3.eth.getBlock(transList[0].blockHash);
    //   // console.log(block.timestamp);
    //   var date = new Date(block.timestamp*1000);
    //   elt.time = moment(date).format('DD/MM/YYYY, h:mm:ss a');
    // })
    // console.log(transList)
    res.render('./admin/functions/transaction',{title: 'Giao dịch', page:'Transaction', transList})
  })
})
module.exports = router