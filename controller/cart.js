const Item = require("../models").Items;
const Cart = require("../models").Carts;
const Product = require("../models").Products;
const Session = require("../models").Sessions;
const Coupon = require("../models").Coupons;
const User = require("../models").Users;

module.exports = {
  async createCartItem(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });
    if (!req.body.couponId)
      return res.status(400).json({ message: "COUPON_ID_MUST_BE_PROVIDED" });

    const product = await Product.findOne({
      where: { productId: req.params.id },
    });
    if (!product) return res.status(400).json({ message: "INVALID_ID" });

    const coupon = await Coupon.findOne({
      where: { couponId: req.body.couponId },
    });
    if (!coupon) return res.status(400).json({ message: "INVALID_COUPON_ID" });

    if (coupon.brands && !coupon.brands.include(product.brand))
      return res.status(400).json({ message: "PRODUCT_BRAND_NOT_ALLOWED" });

    if (coupon.companies && !coupon.companies.include(product.company))
      return res.status(400).json({ message: "PRODUCT_COMPANY_NOT_ALLOWED" });

    const itemValue = coupon.fixedValue
      ? product.value - coupon.value
      : product.value - product.value * coupon.value;

    const item = await Item.create({
      productId: product.productId,
      couponId: coupon.couponId,
      value: itemValue,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json(item);
  },

  async addItemToCart(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "LOGIN_OR_CREATE_FREE_ACCOUNT" });
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });
    if (!req.body.quantity)
      return res.status(400).json({ message: "QUANTITY_MUST_BE_PROVIDED" });

    const user = await User.findOne({
      where: { userId: session.user.userId },
      include: [{ model: Cart, as: "cart" }],
    });

    const item = await Item.findOne({
      where: { itemId: req.params.id },
    });

    item.quantity = req.body.quantity;
    item.total = Math.round((item.quantity * item.value * 100) / 100);
    item.cartId = user.cart.cartId;
    item.updatedAt = new Date().toISOString();
    await item.save();

    const cart = user.cart;
    cart.subTotal += item.total;
    cart.updatedAt = new Date().toISOString();
    await cart.save();

    return res.status(201).json(cart);
  },

  async removeItemFromCart(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    const user = await User.findOne({
      where: { userId: session.user.userId },
      include: [{ model: Cart, as: "cart" }],
    });

    const item = await Item.findOne({
      where: { itemId: req.params.id, cartId: user.cart.cartId },
    });

    if (!item) return res.status(400).json({ message: "INVALID_ID" });

    const cart = user.cart;
    cart.subTotal -= item.total;
    cart.updatedAt = new Date().toISOString();
    const newCart = await cart.save();

    await item.destroy();
    return res.status(200).json(newCart);
  },

  async deleteCartlessItem(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const item = await Item.findOne({
      where: { itemId: req.params.id, cartId: null },
    });

    if (!item) return res.status(400).json({ message: "INVALID_ID" });

    await item.destroy();
    return res.status(204).json({ message: "ITEM_REMOVED_SUCCESSFULLY" });
  },

  async clearCart(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    const user = await User.findOne({
      where: { userId: session.user.userId },
      include: [{ model: Cart, as: "cart" }],
    });

    const cart = await Cart.findOne({
      where: {
        cartId: user.cart.cartId,
        include: [{ model: Item, as: "items" }],
      },
    });

    cart.items.map(async (item) => {
      await item.destroy();
    });

    return res.status(200).json(cart);
  },
};
