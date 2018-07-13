const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({name: username})
    .then( user =>{
        console.log(username);
        if (!user) throw new Error("Incorrect name");
        if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect Password");
        
        return next(null, user);
    })
    .catch(e => {
        next(null, false, {
            message: e.message
        })
    })
}));