module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Products", {
      productId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.DOUBLE(null, 2),
        allowNull: false,
      },
      description: Sequelize.STRING,
      category: Sequelize.STRING,
      brand: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable("Products"),
};
