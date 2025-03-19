'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn("Orders", "orderDate");
    await queryInterface.addColumn("Orders", "midtransId", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Orders", "prescription", {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn("Orders", "orderDate", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn("Orders", "prescription");
    await queryInterface.removeColumn("Orders", "midtransId");
  }
};
