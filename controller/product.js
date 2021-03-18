const Product = require("../models").Products;
const Coupon = require("../models").Coupons;
const Session = require("../models").Sessions;
const User = require("../models").Users;

module.exports = {
  async createProduct(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (session.user.role === "CUSTOMER")
      return res
        .status(403)
        .json({ message: "CUSTOMER_CANNOT_PERFORM_THIS_ACTION" });

    if (!req.body.name || !req.body.value)
      return res.status(400).json({ message: "PROVIDE_NAME_AND_VALUE" });

    const product = await Product.create({
      name: req.body.name,
      value: Math.round(req.body.value * 100) / 100,
      createdAt: new Date().toISOString(),
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
    });

    return res.status(201).json(product);
  },

  async listProducts(_req, res) {
    const products = await Product.findAll({});
    return res.status(200).json(products);
  },

  async readProduct(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const product = await Product.findOne({
      where: { productId: req.params.id },
    });

    if (!product) return res.status(400).json({ message: "INVALID_ID" });

    return res.status(200).json(product);
  },

  async updateProduct(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (session.user.role === "CUSTOMER")
      return res
        .status(403)
        .json({ message: "CUSTOMER_CANNOT_PERFORM_THIS_ACTION" });

    const product = await Product.findOne({
      where: { productId: req.params.id },
    });

    if (!product) return res.status(400).json({ message: "INVALID_ID" });

    if (req.body.name) product.name = req.body.name;
    if (req.body.value) product.value = Math.round(req.body.value * 100) / 100;
    if (req.body.category) product.category = req.body.category;
    if (req.body.brand) product.brand = req.body.brand;
    if (req.body.description) product.description = req.body.description;

    product.updatedAt = new Date().toISOString();

    await product.save();
    return res.status(201).json(product);
  },

  async deleteProduct(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (session.user.role === "CUSTOMER")
      return res
        .status(403)
        .json({ message: "CUSTOMER_CANNOT_PERFORM_THIS_ACTION" });

    const product = await Product.findOne({
      where: { productId: req.params.id },
    });

    if (!product) return res.status(400).json({ message: "INVALID_ID" });

    await product.destroy();
    return res.status(204).json({ message: "PRODUCT_DELETED_SUCCESSFULLY" });
  },
};
