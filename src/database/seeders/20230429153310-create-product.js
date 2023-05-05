'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          id: 'daa7ea52-71e7-412d-b250-8a0cf3dd8267',
          name: 'iPad',
          price: 2000,
          quantity: 27,
          categoryId: 'daa7ea52-71e7-412d-b250-8a0cf3dd8212',
          description: 'Made from quality Italian premium Leather',
          expiryDate: '2030-02-09',
          images: [
            'https://example.com/images/product1.jpg',
            'https://example.com/images/product1-thumb.jpg',
            'https://example.com/images/product2-thumb.jpg',
            'https://example.com/images/product3-thumb.jpg',
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'b97391ee-dbf6-40ac-9490-575076785672',
          name: 'iPhone 15',
          price: 1800,
          quantity: 8,
          categoryId: 'daa7ea52-71e7-412d-b250-8a0cf3dd8212',
          description: 'Demo descripton',
          expiryDate: '2030-02-09',
          images: [
            'https://example.com/images/product1.jpg',
            'https://example.com/images/product1-thumb.jpg',
            'https://example.com/images/product2-thumb.jpg',
            'https://example.com/images/product3-thumb.jpg',
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'f7cc772b-0e83-48d5-ba71-872fa8c7ec5f',
          name: 'iPhone 14',
          price: 1200,
          quantity: 8,
          categoryId: 'daa7ea52-71e7-412d-b250-8a0cf3dd8212',
          description: 'Demo descripton',
          expiryDate: '2030-02-09',
          images: [
            'https://example.com/images/product1.jpg',
            'https://example.com/images/product1-thumb.jpg',
            'https://example.com/images/product2-thumb.jpg',
            'https://example.com/images/product3-thumb.jpg',
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
