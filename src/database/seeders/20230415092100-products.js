"use strict";
const { v4: uuidv4 } = require("uuid");
const { UUIDV4 } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      {
        id: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
        name: "electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "d65dbd98-92b6-4f9d-bf1b-14b2a5821f9e",
        name: "furniture",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
          fullname: "Seller",
          email: "seller@gmail.com",
          //the hashed password below is 'Jolive@12'
          password:
            "$2b$10$5DSMibkzpr.EAMI3I3Tysumk4UaX.1o9ill3U4PeKhOZf7OYGVUc6",
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3acbab4a-6c19-4d72-885a-9e99bdc4cd42",
          fullname: "buyer",
          email: "buyer@gmail.com",
          //the hashed password below is 'Jolive@12'
          password:
            "$2b$10$5DSMibkzpr.EAMI3I3Tysumk4UaX.1o9ill3U4PeKhOZf7OYGVUc6",
          roleId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert("Products", [
      {
        id: "48d92c8b-540f-408c-a2ba-1be73fb8f31d",
        name: "Product 1",
        categoryId: "d65dbd98-92b6-4f9d-bf1b-14b2a5821f9e",
        vendorId: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
        price: 10.99,
        quantity: 10,
        images: ["image1.jpg", "image2.jpg"],
        description: "Lorem ipsum dolor sit amet",
        bonus: 5,
        expiryDate: new Date("2023-12-31"),
        ec: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
