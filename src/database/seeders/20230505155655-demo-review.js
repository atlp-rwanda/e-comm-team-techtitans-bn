'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * */
      await queryInterface.bulkInsert('Reviews', [{
        id:'f6208c1b-fb03-4ebf-93e2-879ab56cf3cf',
        ratings: '4',
        feedback:'hello rate me',
        buyer_id:'32cc953f-38f9-4979-b620-cded5304a0a6',
        product_id:'daa7ea52-71e7-412d-b250-8a0cf3dd8267',
        createdAt: new Date(),
        updatedAt: new Date(),
     }], {});
    
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Reviews', null, {});
  }
};
