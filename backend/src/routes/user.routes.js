const {Router} = require("express");
const {registerUser, loginUser} = require("../controllers/user.controller.js");
const {body} = require("express-validator");
const router = Router();

router.route("/register").post([
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 })
    ],
    registerUser);
    
router.route("/login").post([
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
    ],
    loginUser);

module.exports = router;