const express = require("express");
var cors = require("cors");
require("dotenv").config();

const userRoutes = require("./route/user");
const productRoutes = require("./route/product");
const couponRoutes = require("./route/coupon");
const cartRoutes = require("./route/cart");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/coupon", couponRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 3456;

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
