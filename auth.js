// var ensureAuth = function ensureAuthenticated(req, res, next){
//   if(req.isAuthenticated()){
//    next();
//   }
//   req.flash("error", "Bạn phải đăng nhập để thực hiện chức năng này!!");
//   res.redirect("/");
// }     
let isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type == 'user')   
    return next();
  req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
  res.redirect("/");
} 
let isIssuer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type == 'issuer')
    return next(); 
  req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
  res.redirect("/");
}
let isSchool = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type == 'school')
    return next(); 
  req.flash("alert" , "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
  res.redirect("/");
}
let isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type == 'admin')
    return next();
  req.flash("alert", "Bạn phải dùng tài khoản netmark và đăng ký để truy cập trang web này!!");
  res.redirect("/");
}

module.exports = {
  // ensureAuth,
  isUser, 
  isIssuer, 
  isAdmin, 
  isSchool
};