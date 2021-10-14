const express = require("express");
const router = express.Router();

router.use("/certificate", require('./certificate'));
router.use("/degree", require('./degree'));

router.get("/", (req, res) => {
  res.render("./issuer",{title:"Issuer", page:" index"});
});


module.exports = router;
