const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router.post("/signup", authController.SignUp);
router.post("/Validate", authController.activateEmail);
router.post("/Login", authController.login);
router.post("/refresh_token", authController.getAccessToken);
module.exports = router;
