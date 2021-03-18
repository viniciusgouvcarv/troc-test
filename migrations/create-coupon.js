module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Coupons", {
      couponId: {
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
      fixedValue: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      categories: Sequelize.ARRAY(Sequelize.STRING),
      brands: Sequelize.ARRAY(Sequelize.STRING),
      description: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable("Coupons"),
};
