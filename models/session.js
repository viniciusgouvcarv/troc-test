module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Sessions", {
    sessionId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });

  Session.associate = (models) => {
    Session.belongsTo(models.Users, {
      onDelete: "CASCADE",
      foreignKey: "userId",
      as: "user",
    });
  };

  return Session;
};
