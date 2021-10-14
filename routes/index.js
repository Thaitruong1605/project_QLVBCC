const express = require("express");
var router = express.Router();
var Auth = require('../auth'); // kiem tra trang thai dang nhap

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.alert = req.flash("alert");
    res.locals.msg = req.flash("msg");
    next(); // đi đến route tiếp theo
})

router.use("/", require('./home'));
// router.use("/issuer", require('./issuer/function'));
router.use("/admin", require("./admin/function"));
router.use("/student", require("./student/function"));
router.use("/issuer", require("./issuer/function"));

module.exports = router;