const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// SecretKey for JWT
const secretOrKey = require("../../config/keys").secretOrKey;

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Working" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    console.log(isValid);
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already in use";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcryptjs.genSalt(12, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @router  POST api/users/login
// @desc    Login User / Generate (Return) JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    console.log(isValid);
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user, If there is no user, it will return false
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcryptjs.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Creating JWT payload

        // Sign Token
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) console.log(err);
          return res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @router  GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
