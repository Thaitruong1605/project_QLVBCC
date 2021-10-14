const express = require("express");
const passport = require("passport");
const router = express.Router();
const fs = require('fs');
const issuerModel = require("../../models/issuerModel");
const contract = require("@truffle/contract");
const bytes32 = require('bytes32');
const SHA256 = require('sha256');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:7545");

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.use('/issuer', require('./functions/issuer'));
router.use('/student', require('./functions/student'));
router.use('/account', require('./functions/account'));

let get_issuer = async () => {
  var issuer;
  try {
    var data = await issuerModel.issuer_selectbyId("ISR0001").then(function(data){
      return data[0];
    });
    issuer = {
      name: data.issuer_name, 
      addressPlace: data.issuer_address,
      phoneNumber: data.issuer_phone,
      email: data.issuer_email,
      fax: data.issuer_fax,
      website: data.issuer_website
    }
  }catch (err){
    console.log(err);
  }
  return issuer;
}
router.get('/create_student_contract', async (req,res) => {
  var stuAddr = "0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701"
  const StudentAtrifact = JSON.parse(fs.readFileSync('./src/abis/Student.json'));
  const StudentContract = contract(StudentAtrifact);
  StudentContract.setProvider(provider);

  const stInstane = await StudentContract.new({from: "0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701"});
  var iaddr = stInstane.address;
console.log(iaddr);
  const systemInstance = await SystemContract.deployed();
  await systemInstance.addStudent(stuAddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'} );
  await systemInstance.changeStudentContract(stuAddr,iaddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'} );
  // await systemInstance.addCerf(stuAddr,"0x70cE91A72dbE08aaD8766aE09E977d559C13B806", "hash_value",{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})

})
router.get('/add_cert' ,async(req, res) => {
  var stuAddr = "0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701";
  const systemInstance = await SystemContract.deployed();
  // var bytes32_val = bytes32({input: "019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10"});
  var bytes32_val = '0x019e728cd09412e77d7e63485409fc8f9453780cdde3ef4d10132761902bf4c3';
  console.log(bytes32_val);
  await systemInstance.addCerf(stuAddr,"0x70cE91A72dbE08aaD8766aE09E977d559C13B806",bytes32_val,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
})
router.get('/create_issuer_contract', async (req,res) => {
  // tao hop dong issuer 
  var issuerAddr = '0x70cE91A72dbE08aaD8766aE09E977d559C13B806';
  const IssuerAtrifact = JSON.parse(fs.readFileSync('./src/abis/Issuer.json'));
  const IssuerContract = contract(IssuerAtrifact);
  IssuerContract.setProvider(provider);
  
  var issuer = await get_issuer();
  console.log(issuer);
  
  const isrInstance = await IssuerContract.new(issuer.name, issuer.addressPlace, issuer.phoneNumber, issuer.email, issuer.fax, issuer.website,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'});
  // // await IssuerContract.transferOwnership(issuerAddr,{from: issuerAddr});
  // // const isrInstance = await IssuerContract.at('0x452c8C8Dc76C6D18F5bb18E2c79F04D010EFAAb2');
  // console.log(isrInstance.address);
  // const systemInstance = await SystemContract.deployed();
  // await systemInstance.addIssuer(issuerAddr,{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'} );
  // await systemInstance.changeIssuerContract(issuerAddr,isrInstance.address ,{from:'0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
  // var addr = await systemInstance.mapIssuer.call(issuerAddr);
  // res.send(addr);
})
router.get('/get_issuer_data', async(req, res)=> {
  // 0xfd3793bebf81E084AD71F1fbCdf1AA44D02FB2d7
  const IssuerAtrifact = JSON.parse(fs.readFileSync('./src/abis/Issuer.json'));
  const IssuerContract = contract(IssuerAtrifact);
  IssuerContract.setProvider(provider);
  var i = await IssuerContract.at('0x14736CBf4985c0518a841C41Cdb69486deeED1e3');
  console.log(i.address);
  var returndata = await i.getData();
  console.log(returndata);
})
router.get('/get_issuer_contract_address', async (req, res) => {
  const systemInstance = await SystemContract.deployed();
  var a = await systemInstance.mapIssuer.call('0x70cE91A72dbE08aaD8766aE09E977d559C13B806');
  console.log(a)
})


router.get('/', (req, res) => {
  res.render('./admin',{title: "Dashboard"});
})


module.exports = router