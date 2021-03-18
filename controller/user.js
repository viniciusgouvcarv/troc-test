const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models").Users;
const Session = require("../models").Sessions;
const Cart = require("../models").Carts;
const Item = require("../models").Items;

module.exports = {
  async register(req, res) {
    if (!req.body.username || !req.body.password || !req.body.name)
      return res
        .status(400)
        .json({ message: "PROVIDE_NAME_USERNAME_AND_PASSWORD" });

    const checkUsername = await User.findAll({
      where: { username: req.body.username },
    });

    if (checkUsername.length > 0)
      return res.status(400).json({ message: "USERNAME_ALREADY_IN_USE" });

    const passwordHash = await bcrypt.hash(req.body.password.toString(), 12);

    const user = await User.create({
      username: req.body.username,
      passwordHash,
      name: req.body.name,
      createdAt: new Date().toISOString(),
      role: "CUSTOMER",
    });

    const token = crypto.randomBytes(48).toString("hex");

    await Cart.create({
      userId: user.userId,
      subTotal: 0,
    });

    const session = await Session.create({
      userId: user.userId,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      token: token,
    });

    return res.status(201).json(session);
  },

  async login(req, res) {
    if (!req.body.username || !req.body.password)
      return res.status(400).json({ message: "PROVIDE_USERNAME_AND_PASSWORD" });

    const user = await User.findOne({
      where: { username: req.body.username },
      include: [{ model: Session, as: "sessions" }],
    });

    const passwordHash = await bcrypt.hash(req.body.password.toString(), 12);

    if (!user || (await bcrypt.compare(passwordHash, user.passwordHash))) {
      return res
        .status(404)
        .json({ message: "USER_NOT_FOUND_OR_INCORRECT_PASSWORD" });
    }

    const last = user.sessions.length - 1;
    user.sessions[last].status = "INACTIVE";
    user.sessions[last].updatedAt = new Date().toISOString();

    await user.sessions[last].save();

    const token = crypto.randomBytes(48).toString("hex");

    const session = await Session.create({
      userId: user.userId,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      token: token,
    });

    return res.status(201).json(session);
  },

  async logout(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
    });

    if (!session) return res.status(401).json({ message: "INVALID_TOKEN" });

    session.status = "INACTIVE";
    session.updatedAt = new Date().toISOString();
    await session.save();

    return res.status(200).json({ message: "LOGGED_OUT_SUCCESSFULLY" });
  },

  async listUsers(_req, res) {
    const users = await User.findAll({});
    const userList = users.map((user) => {
      return {
        userId: user.userId,
        name: user.name,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return res.status(200).json(userList);
  },

  async readUser(req, res) {
    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const user = await User.findOne({
      where: { userId: req.params.id },
      include: [{ model: Cart, as: "cart" }],
    });
    if (!user) return res.status(400).json({ message: "INVALID_ID" });

    const cart = await Cart.findOne({
      where: { cartId: user.cart.cartId },
      include: [{ model: Item, as: "items" }],
    });

    const safeUser = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      shoppingCart: cart,
    };
    return res.status(200).json(safeUser);
  },

  async updateUser(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (req.body.username) session.user.username = req.body.username;
    if (req.body.password)
      session.user.passwordHash = await bcrypt.hash(req.body.password, 12);
    if (req.body.name) session.user.name = req.body.name;

    session.user.updatedAt = new Date().toISOString();

    const user = await session.user.save();

    const safeUser = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json(safeUser);
  },

  async changeUserRole(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: [{ model: User, as: "user" }],
    });

    const roles = ["ADMIN", "EMPLOYEE", "CUSTOMER"];

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    if (session.user.role !== "ADMIN")
      return res
        .status(403)
        .json({ message: "ONLY_ADMIN_CAN_CHANGE_USER_ROLES" });

    if (!roles.includes(req.body.role))
      return res.status(400).json({ message: "ROLE_NOT_ALLOWED" });

    if (!req.params.id)
      return res.status(400).json({ message: "ID_MUST_BE_PROVIDED" });

    const user = await User.findOne({ where: { userId: req.params.id } });
    if (!user) return res.status(400).json({ message: "INVALID_ID" });

    user.role = req.body.role;
    user.updatedDate = new Date().toISOString();

    await user.save();

    const safeUser = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json(safeUser);
  },

  async deleteUser(req, res) {
    const session = await Session.findOne({
      where: { token: req.headers["x-access-token"], status: "ACTIVE" },
      include: { model: User, as: "user" },
    });

    if (!session || !session.user)
      return res.status(401).json({ message: "INVALID_TOKEN" });

    await session.user.destroy();
    return res.status(204).json({ message: "USER_DELETED_SUCCESSFULLY" });
  },
};
