module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Products", {
    productId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DOUBLE(null, 2),
      allowNull: false,
    },
    category: DataTypes.STRING,
    brand: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Items, {
      foreignKey: "productId",
      as: "items",
    });
  };

  return Product;
};
