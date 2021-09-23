const signupModel = require("../models/signupModel");

let createUser = async (req, res) => {
  let error = [];
 
  // bao loi 
  if (error && error.length > 0) {
      console.log(error)
      req.flash("error", error);
      res.redirect("/signup");
  } else {
      let student = req.body;
        console.log(student);
      // add user to database
      try {
          await signupModel.add_Student(student);
          return res.redirect("/student");
      } catch (err) {
          req.flash("error", err);
          return res.redirect(req.get('referer'));
      }
  }
}

module.exports = {
  createUser,
}