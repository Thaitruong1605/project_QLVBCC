const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const moment = require('moment');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require('../../models/userModel');
const accountModel = require('../../models/accountModel');
const certificateModel = require('../../models/certificateModel')


const Web3 = require ('web3');
const provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
const web3 = new Web3( provider );
const contract = require('@truffle/contract');

var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
SystemContract.setProvider(provider);

router.get('/', async (req, res)=> {
  res.redirect('/user/danh-sach-chung-chi');
})
// router.get('/danh-sach-giao-dich',async (req, res) => {
//   let user_idNumber;
//   try {
//     await userModel.select_idNumberbyId(req.user.user_id).then(function(data){
//       return user_idNumber = data;
//     })
//   }catch(err){
//     console.log(err)
//   }
//   const sysI = await SystemContract.deployed();
//   let userCA;
//   try{
//     userCA = await sysI.getUserContractAddr(user_idNumber);
//   }catch(err){ console.log(err); return; }
//   var userI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/User.json'))['abi'], userCA);

//   let data = await userI.getPastEvents('allEvents',{
//     fromBlock: 0
//   },async function(error, event){ 
//     if(error) console.log(error);
//     return event;
//   })
//   console.log(data);

// })
router.get('/danh-sach-chung-chi',async (req, res) => {
  var user_idNumber
  try {
    await userModel.select_idNumberbyId(req.user.user_id).then(function(data){
      return user_idNumber = data;
    })
  }catch(err){
    console.log(err)
  }
  try{
    await certificateModel.select_byIdNumber(user_idNumber).then(function(data){
      return res.render("./user",{title:"Danh sách văn bằng chứng chỉ",certList:data, page:"danh-sach-chung-chi", moment}); 
    })
  }catch (err){
    console.log(err)
  }
})
router.get('/doi-mat-khau', async(req, res)=>{
  res.render('./user/doimatkhau.ejs',{title:"Đổi mật khẩu", page:'doi-mat-khau'});
})
router.post('/doi-mat-khau',  async(req, res)=>{
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
  res.redirect('/user/doi-mat-khau',{page:'doi-mat-khau'});
})
router.get('/thong-tin-ca-nhan',async(req, res)=>{
  var user, account ;
  try{
    await accountModel.get_accountById(req.user.user_id).then(function(data){
      return account  = data;
    })
  }catch(err){
    console.log(err);
  }
  try{
    await userModel.select_byId(req.user.user_id).then(function(data){
      return user = data;
    })
  }catch(err){
    console.log(err);
  }
  res.render('./user/info',{title: 'Thông tin cá nhân',user, account, moment, page:'thong-tin-ca-nhan'});
})
router.post('/edit',async (req, res)=>{
  var user_info = req.body;
  if (typeof user_info.user_birth != 'undefined'){
    user_info.user_birth = moment(user_info.user_birth, 'DD/MM/YYYY').format()
  }
  try {
    await userModel.update(req.user.user_id,user_info);
    req.flash('msg','Cập nhật thông tin cá nhân thành công!');
  }catch (err){
    console.log(err);
  }
  res.redirect('back');
})
router.post('/update-info', async(req, res)=>{
  let data = {}
  if (req.body.name == 'user_birth') {
    data[req.body.name] = moment(req.body.value.trim(),'DD/MM/YYYY').format();
  }else {
    data[req.body.name] = req.body.value.trim();
  }
  try{
    await userModel.update(req.user.user_id, data)
    req.flash('msg',"Cập nhật thông tin thành công!");
  }catch(err){
    console.log(err);
  }
  return res.status(200).send({result: 'redirect', url:'/user/thong-tin-ca-nhan'})
})
router.get("/lich-su-giao-dich", async (req, res)=> {
  const sysI = await SystemContract.deployed();
  // I. Create school intance 
  const userAddr = req.user.account_address ;
  const schCA = await sysI.getUserContractAddr(userAddr);

  var userI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/User.json'))['abi'], schCA);
  // II. list transactions 
  var data = await userI.getPastEvents('allEvents',{
    fromBlock: 0
  },async function(error, event){ 
    if(error) console.log(error);
    return event;
  })
  var transactionList = []

  for (i= Object.keys(data).length-1; i>= 0; i-- ){
    transactionList.push({
      transactionHash: data[i].transactionHash,
      returnValues: data[i].returnValues,
      event: data[i].event,
      blockNumber: data[i].blockNumber,
      timestamp: moment.unix((await web3.eth.getBlock(data[i].blockNumber)).timestamp).format("DD/MM/YYYY, hh:mm:ss a")
    })
    // if (data[i].event == "addedCertificate") {
    //   transactionList[transactionList.length-1].event = `addedCertificate(${data[i].returnValues._certNumber})`
    // }else if (data[i].event == "deactivatedCertificate") {
    //   transactionList[transactionList.length-1].event = `deactivatedCertificate(${data[i].returnValues._certNumber})`
    // }
  }
  return res.render("./user/transactions",{title:"Lịch sử giao dịch",transactionList, page:"lich-su-giao-dich"}); 
})

module.exports = router;
