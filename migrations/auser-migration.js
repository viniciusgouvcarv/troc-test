module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "EMPLOYEE", "CUSTOMER"),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Users"),
};
