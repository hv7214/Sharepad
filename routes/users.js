const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/Users');

// Login Page
router.get('/login', (req, res) => {
  let success_msg = req.query.msg;
  res.render('login', {success_msg} );
});

// Signup Page
router.get('/signup', (req, res) => res.render('signup'));

//Signup
router.post('/signup', (req, res) => {
  const {
    username,
    email,
    password1,
    password2
  } = req.body;

  let errors = [];
  var success_msg;

  //Requiring UserSchema
  const User = require('../models/Users');

  //Check req fields
  if (!username || !email || !password1 || !password2) {
    errors.push({
      msg: 'Please fill all details'
    });
  } else {
    //Password length
    if (password1.length < 6) {
      errors.push({
        msg: 'Password should be of atleast 6 characters'
      });
    } else {
      //Match password match
      if (password1 != password2) {
        errors.push({
          msg: 'Passwords do not match'
        });
      }
    }
  }

  if (errors.length > 0) {
    res.render('signup', {
      errors,
      username,
      email,
      password1,
      password2
    });
  } else {

    //Checking for email already exists
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          //email exists
          errors.push({
            msg: "Email-id is already used"
          });
          res.render('signup', {
            errors,
            username,
            email,
            password1,
            password2
          });
        } else {
          var password = password1;
          var name = username;

          const newUser = new User({
            name,
            email,
            password
          });

          console.log(newUser);

          //hash password
          bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, (err, hash)=> {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
            .then(user => {
              success_msg = "Registered Successfully! Now log in";
              res.redirect('/users/login?msg=' + success_msg);
            })
            .catch(err => console.log(err));
          }));
        }
      });
  }
});

//Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: false
  })(req, res, next);
});

module.exports = router;
