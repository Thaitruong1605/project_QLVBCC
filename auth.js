var ensureAuth = function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      next();
  }else {
      req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
      res.redirect("/signup");
  }
}   
module.exports = {ensureAuthenticated: ensureAuth};