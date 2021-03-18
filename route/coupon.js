const express = require("express");
const controller = require("../controller/coupon");

const router = express.Router();

router.get("/list", controller.listCoupons);
router.get("/read/:id", controller.readCoupon);
router.post("/create", controller.createCoupon);
router.put("/update/:id", controller.updateCoupon);
router.delete("/delete/:id", controller.deleteCoupon);

module.exports = router;
