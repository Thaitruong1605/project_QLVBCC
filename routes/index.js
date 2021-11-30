const express = require("express");
const router = express.Router();
const Auth = require('../auth'); // kiem tra trang thai dang nhap

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.alert = req.flash("alert");
    res.locals.msg = req.flash("msg");
    next(); // đi đến route tiếp theo
})

router.use("/", require('./home'));
router.use("/admin",Auth.isAdmin , require("./admin/function"));
router.use("/user",Auth.isUser, require("./user/function"));
router.use("/school",Auth.isSchool, require("./school/function"));
router.use("/issuer",Auth.isIssuer, require("./issuer/"));

module.exports = router;