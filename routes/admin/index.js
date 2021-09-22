const express = require("express");

var router = express.Router();


router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.alert = req.flash("alert");
    next(); // đi đến route tiếp theo
})

router.use("/",require("./functions"));

module.exports = router;