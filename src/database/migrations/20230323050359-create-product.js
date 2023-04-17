'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Categories',
          key: 'id',
          as: 'categoryId',
        },
      },
      stock: {
        type: Sequelize.ENUM('available', 'out of stock', 'expired'),
        defaultValue: 'available',
      },
      vendorId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'vendorId',
        },
      },
      price: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      description: Sequelize.STRING,
      bonus: Sequelize.INTEGER,
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ec: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
