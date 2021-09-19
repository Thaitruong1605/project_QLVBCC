var ensureAuth = function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      next();
  }else {
      req.flash("alert" , "Bạn phải đăng nhập để thực hiện chức năng này!!");
      res.redirect("/login");
  }
}   
module.exports = {ensureAuthenticated: ensureAuth};