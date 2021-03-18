module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Sessions", {
      sessionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: { type: Sequelize.ENUM("ACTIVE", "INACTIVE"), allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "userId",
          as: "userId",
        },
      },
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable("Sessions"),
};
