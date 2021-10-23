const express = require("express");
const router = express.Router();
const moment = require("moment");
const accountModel = require("../../models/accountModel");
const accountController = require("../../controllers/accountController");

router.get("/", (req, res) => {
  // Lay du lieu account
  try{
    accountModel.select().then(function(data){
      return res.render("./admin/functions/account",{title:"Danh sách tài khoản", account_list:data, moment, page:"User"});
    })
  }catch(err){
    console.log(err);
    return res.redirect("/admin");
  }
})
// POST -----------------------------------------
router.post("/get-data", async( req, res)=> {
  var account_info; 
  try{
    await accountModel.get_accountByUsername(req.body.username).then(function(data){
      return account_info = data;
    })
  }catch(err){
    console.log(err);
    return;
  }
  res.json({account_info:account_info});
})
router.post("/delete", async (req, res) => {
  try{
    await accountModel.remove(req.body.account_address).then(function(data){
      console.log(data);
      req.flash("msg",data);
      res.redirect("back");
    });
  }catch(err){
    console.log(err);
    req.flash("error",err);
    res.redirect("back");
  }
})
router.post("/update", (req, res) => {
  accountController.update(req, res);
})
module.exports = router;