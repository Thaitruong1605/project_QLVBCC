let ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()){
    next();
  }else {
    req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
    res.redirect("/");
  }
}
let isStudent = (req, res, next) => {
  if (req.isAuthenticated())
    if (req.session.passport.user.account_type == 'student'){
      next();
   }else {
    req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
    res.redirect("/");
  }
} 
let isIssuer = (req, res, next) => {
  if (req.isAuthenticated())
    if (req.session.passport.user.account_type == 'issuer'){
      next();
    } else {
      req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
      res.redirect("/");
    }
}
let isAdmin = (req, res, next) => {
  if (req.isAuthenticated())
  if (req.session.passport.user.account_type == 'admin'){
    next();
  } else {
    req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
    res.redirect("/");
  }
}
module.exports = {ensureAuthenticated , isStudent, isIssuer, isAdmin};