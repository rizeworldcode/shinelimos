const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicles");
const upload = require("../../middleware/multer");

// Create vehicle
router.post("/vehicles", upload.single("image"), vehicleController.add_newVehicle);

// Update vehicle
router.put("/vehicles", upload.single("image"), vehicleController.updateVehicle_details);

// Delete vehicle
router.delete("/deleteVehicles", vehicleController.deleteVehicle);

// Search vehicles by capacity
router.get("/vehicles/search", vehicleController.getVehicles_byCapacity);

module.exports = router;
