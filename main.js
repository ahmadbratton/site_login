const express = require("express");
const mex = require("mustache-express");
const bodyparser = require("body-parser");
const app = express();
const expressValidator = require("express-validator");
const path = require("path");
const session = require("express-session");
const jsonfile = require("jsonfile");

app.engine("mustache", mex());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(expressValidator());

app.use(session({
  secret:"nskl",
  resave: false,
  saveUninitialized:false
}));

let messages = [];
let users = [{
  username:"ahmadbratton",
  password:"getmoney"
}];

app.get("/", function (req , res) {
  if (req.session.username){

    res.render("user", {username:req.session.username });
  }
   else {
    res.redirect("/login");
  }


});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/signup", function (req, res) {
  res.render("signup");
})



app.post("/login", function (req, res) {
  let actual_user;
users.forEach(function (user) {
  if (user.username === req.body.username)
  actual_user = user;
  else{
    actual_user = [{
      username:"",
      password:""
    }];
  }
});

  req.session.username = req.body.username
  req.checkBody("username", "please enter a valid username").notEmpty();
  req.checkBody("password", "please enter a valid password").notEmpty();
  req.checkBody("password", "invalid username and password combo").equals(actual_user.password);
  let errors = req.validationErrors();

  if (errors){
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    res.render("login", {errors:messages})
  }else {
    res.redirect("/");
  }

});

app.post("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/login");

});


app.listen(3000, function () {
  console.log("whats up mane");
});
