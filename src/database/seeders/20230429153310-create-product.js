'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          id:"daa7ea52-71e7-412d-b250-8a0cf3dd8267",
          name: "iPad",
          price: 2000,
          quantity: 27,
          categoryId: "daa7ea52-71e7-412d-b250-8a0cf3dd8212",
          description: "Made from quality Italian premium Leather",
          expiryDate: "2030-02-09",
          images: [
            "https://example.com/images/product1.jpg",
            "https://example.com/images/product1-thumb.jpg",
            "https://example.com/images/product2-thumb.jpg",
            "https://example.com/images/product3-thumb.jpg"
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
