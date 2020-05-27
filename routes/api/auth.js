const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

// @route   GET api/auth
// @desc    Test get user info
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Get all the fields except the password field
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user (Login page) and get jwt token
// @access  Public
router.post(
  "/",
  [
    // check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }); // Find a user with the same email
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials." }] });
      }

      // Compare the plaintext password with the encrypted password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {  // Passwords do not match
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      let secure_user = JSON.parse(JSON.stringify(user));  // Deep copy
      delete secure_user.password;  // Avoid sending password in response

      // Generate jwt token to return to browser

      const payload = {  // jwt payload
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: config.get("tokenexpirationsecs") },  // TODO - What's the appropriate expire duration?
        (err, token) => {
          if (err) throw err;
          res.json({ token : token, user : secure_user }); // Set the response to the token
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
