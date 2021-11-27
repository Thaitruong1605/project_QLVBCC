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
const { reset } = require("nodemon");
// const provider = new Web3.providers.HttpProvider('');
const web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545"))
// const web3 = new Web3( provider );
// const contract = require('@truffle/contract');

// var SystemContract = contract(JSON.parse(fs.readFileSync('./src/abis/System.json')));
// SystemContract.setProvider(provider);

// var UserContract = contract(JSON.parse(fs.readFileSync('./src/abis/User.json')));
// UserContract.setProvider(provider);
router.get('/test',async (req, res)=> {
  // var account_address = '0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701';
  var sysI = new web3.eth.Contract(JSON.parse(fs.readFileSync('./src/abis/System.json'))['abi'],'0x10D8a7B2Ae872CaB10E2aB6fC6574eD2B791AAE1');
  // var sysI = await SystemContract.deployed();
  // console.log(await sysI.getContractbyIDNumber('111111111122'));
  // var stuI = new web3.eth.Contract( JSON.parse(fs.readFileSync('./src/abis/User.json'))['abi'],await sysI.getContractbyIDNumber('111111111122'));
  // console.log(stuI.methods.viewCertificate('0x63feafc9f8c3ce83825633d05b14e80b035ss599a8e95a3e83d178896caed61e6d'))
  // console.log(stuI.options.jsonInterface)
})
router.get('/', async (req, res)=> {
  var user_id = req.user.user_id;
  var email = await userModel.select_emailbyId(user_id);
  var certList;
  try{
    await certificateModel.select_byEmail(email.user_email).then(function(data){
      return certList = data;
    })
  }catch (err){
    console.log(err)
  }
  res.render('./user/',{title:'Danh sách văn bằng chứng chỉ.', certList, page: "Cert"});
  // var account_address = req.query.account_address
  // var stuI = new web3.eth.Contract( JSON.parse(fs.readFileSync('./src/abis/User.json'))['abi'],'0x1a4c9c0B32bAc586636da5A7e90E15F6bBEAAe5f');
  // await web3.eth.getTransaction('0x9a541439842a3299fcfc7eabb0da5614a4a7dc2b8be92affcf1196bca59ec58f').then(console.log);
  // console.log('account_address: '+account_address);
  // var sysI = await SystemContract.deployed();
  // var stuI = await UserContract.at('0x1a4c9c0B32bAc586636da5A7e90E15F6bBEAAe5f');
  // console.log(stuI)
  // try {
  //   await stuI.viewCertificate('0xef719f8145efc268e37cc5837e2419d9b11968a87b17f7ba7012af29a6b6aabc').then(function(data){
  //     console.log(web3.utils.soliditySha3(data['0']));
  //   });

  // }catch (err){
  //   console.log(err);
  // }
  // await stuI.once('addedCertificate', {
  //   fromBlock: 0
  // }, function(error, event){ console.log(event); });
  //   // console.log(stuI._address)


  // res.send("hello")
})
router.get('/danh-sach-chung-chi',async (req, res) => {
  var user_id = req.user.user_id;
  var email = await userModel.select_emailbyId(user_id);
  var certList;
  try{
    await certificateModel.select_byEmail(email.user_email).then(function(data){
      console.log(data)
      return certList = data; 
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
  res.redirect('/user/doi-mat-khau');
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
  res.render('./user/info',{title: 'Thông tin cá nhân',page:'user',user, account, moment});
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


module.exports = router;
