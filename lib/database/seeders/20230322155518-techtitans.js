"use strict";

const {
  v4: uuidv4
} = require("uuid");
const {
  UUIDV4
} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [{
      id: uuidv4(),
      fullname: "richard",
      email: "richard@gmail.com",
      // the hashed password below is 'Richard@123'
      password: "$2a$12$m8A9MqExqkOUgnKQcUqu1OfHlyPeF34uhB3ztnpdHP4UMLRnvlfuC",
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270",
      fullname: "seller1",
      email: "seller1@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "seller2",
      email: "seller2@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "seller3",
      email: "seller3@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "buyer1",
      email: "buyer1@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "buyer2",
      email: "buyer2@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "buyer3",
      email: "buyer3@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      fullname: "guest",
      email: "guest@gmail.com",
      // the hashed password below is 'Password@123'
      password: "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
      fullname: "Seller",
      email: "seller@gmail.com",
      //the hashed password below is 'Jolive@12'
      password: "$2b$10$5DSMibkzpr.EAMI3I3Tysumk4UaX.1o9ill3U4PeKhOZf7OYGVUc6",
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "3acbab4a-6c19-4d72-885a-9e99bdc4cd42",
      fullname: "buyer",
      email: "buyer@gmail.com",
      //the hashed password below is 'Jolive@12'
      password: "$2b$10$5DSMibkzpr.EAMI3I3Tysumk4UaX.1o9ill3U4PeKhOZf7OYGVUc6",
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};