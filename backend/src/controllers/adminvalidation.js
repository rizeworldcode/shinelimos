const {admin_login,verifyOtp,sendOtpTOadmin,admin_forgatePassword,admin_logout } = require("../services/adminvalidation")

exports.sendOtpTOadmin = async (req, res) => {
    try {
      const data = await sendOtpTOadmin(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.verifyOtp = async (req, res) => {
    try {
      const data = await verifyOtp(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.admin_login = async (req, res) => {
    try {
      const data = await admin_login(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.admin_forgatePassword = async (req, res) => {
    try {
      const data = await admin_forgatePassword(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.admin_logout = async (req, res) => {
    try {
      const data = await admin_logout(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
