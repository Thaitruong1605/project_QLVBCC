var express = require('express');
var passport = require('passport');
var session = require('express-session').Session;
var isLogined = require('../auth').ensureAuthenticated;
var router = express.Router();

router.get('/signup',async (req, res) => {
  console.log("signup");
  res.render('./signup');
})
router.post('/signup', (req, res) => {
  require('../controllers/signupControllers').createUser(req, res);
});

// router.get('/login',async (req, res) => {
//   res.render('./login', {page_name: 'Đăng nhập'});
// })

router.get('/login',
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login', 
      failureFlash: true
  })
);

router.get('/', function (req, res) {
  res.render('./', { page_name: 'Trang chủ' });
});

module.exports = router;