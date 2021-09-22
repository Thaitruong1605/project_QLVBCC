const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get('/',async (req, res) => {
  res.render('./admin');
})
router.use('/issuer', require('./functions/issuer'));

module.exports = router