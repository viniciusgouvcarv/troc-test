module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Items", {
      itemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        type: Sequelize.DOUBLE(null, 2),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DOUBLE(null, 3),
        allowNull: false,
      },
      total: {
        type: Sequelize.DOUBLE(null, 2),
        allowNull: false,
      },
      cartId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Carts",
          key: "cartId",
          as: "cartId",
        },
      },
      couponId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Coupons",
          key: "couponId",
          as: "couponId",
        },
      },
      productId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Products",
          key: "productId",
          as: "productId",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Items"),
};
