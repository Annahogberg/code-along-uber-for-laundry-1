require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

const dburl = process.env.DBURL;
mongoose.connect(dburl).then(() => console.log(`Connected to db: ${dburl}`));

User.collection.drop();

User.create([
  {
    name: "Eva",
    mail: "1234@gmail.com",
    password: bcrypt.hashSync('password', salt),
    isLaunderer: true,
    fee: 2
  },
  {
    name: "Joseph",
    mail: "1234@gmail.com",
    password: bcrypt.hashSync('password', salt),
    isLaunderer: true,
    fee: 3
  },
  {
    name: "Sam",
    mail: "1234@gmail.com",
    password: bcrypt.hashSync('password', salt),
    isLaunderer: true,
    fee: 1.5
  }
]).then(() => {
  console.log("Launderer created");
  mongoose.disconnect();
});
