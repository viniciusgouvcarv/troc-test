module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Carts", {
      cartId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subTotal: {
        default: 0,
        type: Sequelize.INTEGER,
      },
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
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Carts"),
};
