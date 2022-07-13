const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router.post("/signup", authController.SignUp);
module.exports = router;
