const express = require("express");
const controller = require("../controller/cart");

const router = express.Router();

router.post("/createItem", controller.createCartItem);
router.put("/addItemToCart/:id", controller.addItemToCart);
router.delete("/removeItem/:id", controller.removeItemFromCart);
router.delete("/deleteCartlessItem/:id", controller.deleteCartlessItem);
router.put("/clearCart/", controller.clearCart);

module.exports = router;
