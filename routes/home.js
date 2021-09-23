var express = require('express');
var passport = require('passport');
var session = require('express-session').Session;
var isStudent = require('../auth').isStudent;
var router = express.Router();
const loginController = require("../controllers/loginController");

router.get('/signup',async (req, res) => {
  res.render('./signup');
})
router.post('/signup', (req, res) => {
  require('../controllers/signupControllers').createUser(req, res);
});

router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/', 
      failureFlash: true
  })
);
router.get('/asd',isStudent,(req,res) => {
  res.send('connected');
})
router.get('/', function (req, res) {
  
  res.render('./', { page_name: 'Trang chủ' });
});

module.exports = router;