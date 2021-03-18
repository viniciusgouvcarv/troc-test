const Coupon = require("../models").Coupons;
const Session = require("../models").Sessions;
const User = require("../models").Users;

module.exports = {
  async createCoupon(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (session.user.role === "CUSTOMER")
      return res
        .status(403)
        .json({ message: "CUSTOMER_CANNOT_PERFORM_THIS_ACTION" });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (!req.body.name || !req.body.value || !req.body.fixedValue)
      return res
        .status(400)
        .json({ message: "PROVIDE_NAME_FIXEDVALUE_AND_VALUE" });

    const coupon = await Coupon.create({
      name: req.body.name,
      value: Math.round(req.body.value * 100) / 100,
      fixedValue: req.body.fixedValue,
      createdAt: new Date().toISOString(),
      categories: req.body.categories,
      brands: req.body.brands,
      description: req.body.description,
    });

    return res.status(201).json(coupon);
  },

  async listCoupons(_req, res) {
    const coupons = await Coupon.findAll({});
    return res.status(200).json(coupons);
  },

  async readCoupon(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const coupon = await Coupon.findOne({ where: { couponId: req.params.id } });

    if (!coupon) return res.status(400).json({ message: "INVALID_ID" });

    return res.status(200).json(coupon);
  },

  async updateCoupon(req, res) {
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

    const coupon = await Coupon.findOne({ where: { couponId: req.params.id } });

    if (!coupon) return res.status(400).json({ message: "INVALID_ID" });

    if (req.body.name) coupon.name = req.body.name;
    if (req.body.value) coupon.value = Math.round(req.body.value * 100) / 100;
    if (req.body.fixedValue) coupon.fixedValue = req.body.fixedValue;
    if (req.body.categories) coupon.categories = req.body.categories;
    if (req.body.brands) coupon.brands = req.body.brands;
    if (req.body.description) coupon.description = req.body.description;

    coupon.updatedAt = new Date().toISOString();

    await coupon.save();
    return res.status(201).json(coupon);
  },

  async deleteCoupon(req, res) {
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

    const coupon = await Coupon.findOne({ where: { couponId: req.params.id } });

    if (!coupon) return res.status(400).json({ message: "INVALID_ID" });

    await coupon.destroy();
    return res.status(204).json({ message: "PRODUCT_DELETED_SUCCESSFULLY" });
  },
};
