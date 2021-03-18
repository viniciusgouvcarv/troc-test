module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Items", {
    itemId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.DOUBLE(null, 2),
      allowNull: false,
    },
    quantity: DataTypes.DOUBLE(null, 3),
    total: DataTypes.DOUBLE(null, 2),
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Products, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "product",
    }),
      Item.belongsTo(models.Coupons, {
        onDelete: "CASCADE",
        foreignKey: "couponId",
        as: "coupon",
      }),
      Item.belongsTo(models.Carts, {
        onDelete: "CASCADE",
        foreignKey: "cartId",
        as: "cart",
      });
  };

  return Item;
};
