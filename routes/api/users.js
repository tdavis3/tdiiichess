const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");

const User = require("../../models/User");


// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    "/",
    [
        check("first_name", "First name is required")
            .not()
            .isEmpty(), // Ensure the name field is not empty
        check("last_name", "Last name is required")
            .not()
            .isEmpty(), // Ensure the name field is not empty
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password between 8-20 chars").isLength({
            min: 8,
            max: 20
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {first_name, last_name, email, password} = req.body;

        try {
            let user = await User.findOne({email}).select("-password"); // See if a User exists already with same email
            if (user) {
                return res
                    .status(400)
                    .json({errors: [{msg: "User already exists"}]});
            }

            // Simply create an instance of a user, but since password isn't hashed we don't save to db yet
            user = new User({first_name, last_name, email, password});

            // Encrypt password
            const salt = await bcrypt.genSalt(10); // Recommended to use 10
            user.password = await bcrypt.hash(password, salt); // Hash user password
            await user.save(); // Save use to database

            // TODO: There's a better way to do this without copying - Implement
            let secure_user = JSON.parse(JSON.stringify(user));  // Deep copy
            delete secure_user.password;  // Avoid sending password in response

            // Return jsonwebtoken (in order to log the user in immediately on the frontend)
            // Create payload
            const payload = {
                user: {
                    id: user.id // Mongoose uses an abstraction so that you don't need the "_id" underscore
                }
            };

            jwt.sign(
                payload, // Pass in a payload which is the user's unique mongo id or "_id"
                config.get("jwtSecret"),
                {expiresIn: config.get("tokenexpirationsecs")},
                (err, token) => {
                    if (err) throw err;
                    res.json({token: token, user: secure_user}); // Return the token
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send({msg: "Could not register you. Try again!"});
        }
    }
);

// @route   PUT api/users
// @desc    Change a user's email
// @access  Private (A token is needed)
router.put("/", auth, async (req, res) => {
    const {old_email, new_email} = req.body;
    try {
        const updated_user = await User.findOneAndUpdate({email: old_email}, {email: new_email}, {
            new: true,
            rawResult: true
        }).select("-password");
        res.json({result: updated_user.lastErrorObject.n, updated_user: updated_user.value});
    } catch (err) {
        if (err.code === 11000) {
            return res.json({err: 11000});
        }
        console.error(err.message);
        res.status(500).send({msg: "Could not change email. Try again!"});
    }
});

// @route   PUT api/users
// @desc    Change a user's password
// @access  Private (A token is needed)
router.put("/:user_id", auth, async (req, res) => {
    // TODO: Check password length just to be sure
    const {old_password, new_password} = req.body;
    try {
        const user = await User.findById(req.params.user_id);

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(409).send({msg: "Passwords do not match. Try again!"});
        }

        // Encrypt new password
        const salt = await bcrypt.genSalt(10); // Recommended to use 10
        const hashed_password = await bcrypt.hash(new_password, salt); // Hash user password

        const updated_user = await User.findByIdAndUpdate(req.params.user_id, {password: hashed_password}, {
            new: true,
            rawResult: true
        });

        res.json({result: updated_user.lastErrorObject.n, updated_user: updated_user.value});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Could not change password. Try again!"});
    }
});

module.exports = router; // Export the router. Must do this.
