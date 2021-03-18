module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define("Coupons", {
    couponId: {
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
    fixedValue: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    description: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categories: DataTypes.ARRAY(DataTypes.STRING),
    brands: DataTypes.ARRAY(DataTypes.STRING),
    updatedAt: DataTypes.DATE,
  });

  Coupon.associate = (models) => {
    Coupon.hasMany(models.Items, {
      foreignKey: "couponId",
      as: "items",
    });
  };

  return Coupon;
};
