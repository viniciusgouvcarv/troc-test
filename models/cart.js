module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Carts", {
    cartId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    subTotal: {
      default: 0,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Users, {
      onDelete: "CASCADE",
      foreignKey: "userId",
      as: "user",
    });

    Cart.hasMany(models.Items, {
      foreignKey: "cartId",
      as: "items",
    });
  };

  return Cart;
};
