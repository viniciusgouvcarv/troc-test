const express = require("express");
const controller = require("../controller/product");

const router = express.Router();

router.get("/list", controller.listProducts);
router.get("/read/:id", controller.readProduct);
router.post("/create", controller.createProduct);
router.put("/update/:id", controller.updateProduct);
router.delete("/delete/:id", controller.deleteProduct);

module.exports = router;
