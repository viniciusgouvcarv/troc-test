module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "EMPLOYEE", "CUSTOMER"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });

  User.associate = (models) => {
    User.hasMany(models.Sessions, {
      foreignKey: "userId",
      as: "sessions",
    });

    User.hasOne(models.Carts, {
      foreignKey: "userId",
      as: "cart",
    });
  };

  return User;
};
