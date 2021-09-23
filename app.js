require("dotenv").config()
const express = require('express')
const path = require("path")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash"); 
const session = require("express-session");
const passport = require("passport");

var setUpPassport = require("./setuppassport");
var isAuthenticated = require('./auth').ensureAuthenticated; // kiem tra trang thai dang nhap

var app = express() // khoi tao ung dung
setUpPassport();

app.set("port", process.env.PORT) // gan cong chay web
app.set("views", path.join(__dirname,"views")) // thu muc giao dien web
app.set("view engine", "ejs") // render giao dien

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(session({
    secret:"sad123hn412u3h@213",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('./assets'));
app.use(express.static('./public/'));
app.use(express.static('./src/'));

// ROUTES
app.use("/", require("./routes"));
app.use("/admin",isAuthenticated, require("./routes/admin"));
app.use("/student",isAuthenticated, require("./routes/student"));
app.use("/issuer",isAuthenticated, require("./routes/issuer"));

app.listen(app.get("port"), () => {
    console.log("Server started on port "+app.get("port")); // thong bao server duoc khoi dong
})