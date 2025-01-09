const {Router} = require("express");
const {registerUser, loginUser, handleGoogleRedirect, googleData, logoutUser} = require("../controllers/user.controller.js");
const {body} = require("express-validator");
const router = Router();
const passport = require("passport");
const verifyToken = require("../middlewares/auth.middleware.js");

const googleRedirectOauth = passport.authenticate("google", {
    failureRedirect: "/login",
  });

router.route("/register").post([
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 })
    ],
    registerUser
);
    
router.route("/login").post([
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
    ],
    loginUser
);
router.route("/logout").get(logoutUser);

router.route("/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/google/webomato").get(googleRedirectOauth, handleGoogleRedirect);
router.route("/google/data").get(verifyToken,googleData);

module.exports = router;