'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('Notifications', [

         {
           id: 'daa7ea52-71e7-412d-b250-8a0cf3dd8215',
           email: 'buyer5@gmail.com',
           subject: 'this is a test notification',
           body: 'you have new notification',
         createdAt: new Date(),
         updatedAt: new Date(),
         },
             {
                 id: 'daa7ea52-71e7-412d-b250-8a0cf3dd8217',
                 email: 'buyer5@gmail.com',
                 subject: 'this is a test notification',
                 body: 'you have new notification',
                 createdAt: new Date(),
                 updatedAt: new Date(),
             },

     ],
         {});

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
