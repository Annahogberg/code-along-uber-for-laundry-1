const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const authRouter = express.Router();
const bcryptSalt = 10;


authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRouter.post('/signup', (req, res, next) => {

  const { name, password, email } = req.body;

  User.findOne({
    name
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        password: hashPass,
        email,
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    })
})


authRouter.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))

authRouter.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/auth/signup');
})

module.exports = authRouter;