const express = require("express");
const router = express.Router();

router.use("/cert", require('./cert'));
router.use("/degree", require('./degree'));
router.use("/issuer", require('./issuer'));

router.get("/", (req, res) => {
  res.render("./school",{title:"Trang quản lý của trường học", page:"index"});
});

module.exports = router;
