const express = require('express');
const User = require('../models/user');
const laundryRouter = express.Router();
const LaundryPickup = require('../models/laundry-pickup');


laundryRouter.use((req, res, next) => {
  if (req.user) {
    next();
    return;
  }

  res.redirect('/auth/login');
});

laundryRouter.get('/dashboard', (req, res, next) => {
  let query;

  if (req.user.isLaunderer) {
    query = { launderer: req.user._id };
  } else {
    query = { user: req.user._id };
  }

  LaundryPickup
    .find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('pickupDate')
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }

      res.render('laundry/dashboard', {
        pickups: pickupDocs
      });
    });
});

laundryRouter.post('/launderers', (req, res, next) => {
  const userId = req.user._id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  }

  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    req.user = theUser;

    res.redirect('/laundry/dashboard');
  });
})

laundryRouter.get('/launderers', (req, res, next) => {
  User.find({ isLaunderer: true }, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }

    res.render('laundry/launderers', {
      launderers: launderersList
    });
  });
});


laundryRouter.get('/launderers/:id', (req, res, next) => {
  const laundererId = req.params.id;

  User.findById(laundererId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.render('laundry/launderer-profile', {
      theLaunderer: theUser
    });
  });
});

laundryRouter.post('/laundry-pickups', (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.user._id
  };

  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/laundry/dashboard');
  });
});

module.exports = laundryRouter;