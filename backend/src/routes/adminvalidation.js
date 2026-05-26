const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");

const {
admin_login,verifyOtp,sendOtpTOadmin,admin_forgatePassword,admin_logout
} = require("../controllers/adminvalidation");

router.post("/sendOtpTOadmin", sendOtpTOadmin);
router.post("/verifyOtp", verifyOtp);
router.post("/admin_login", admin_login);
router.post("/admin_forgatePassword", admin_forgatePassword);
router.post("/admin_logout",user_auth, admin_logout);

module.exports = router;