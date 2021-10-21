const express = require("express");
const router = express.Router();

router.use("/certificate", require('./certificate'));
router.use("/degree", require('./degree'));
router.use("/issuer", require('./issuer'));
router.use("/verifier", require('./verifier'));

router.get("/", (req, res) => {
  res.render("./issuer",{title:"Issuer", page:" index"});
});

module.exports = router;
