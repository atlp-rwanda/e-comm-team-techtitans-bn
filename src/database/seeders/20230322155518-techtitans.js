const { v4: uuidv4 } = require('uuid');
const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: uuidv4(),
          fullname: "richard",
          email: "richard@gmail.com",
          // the hashed password below is 'Richard@123'
          password:
            "$2a$12$m8A9MqExqkOUgnKQcUqu1OfHlyPeF34uhB3ztnpdHP4UMLRnvlfuC",
          roleId: 1,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "f6208c1b-fb03-4ebf-93e2-879ab56cf3cf",
          fullname: "Disable Account",
          email: "admindisable@gmail.com",
          // the hashed password below is 'Richard@123'
          password:
            "$2a$12$m8A9MqExqkOUgnKQcUqu1OfHlyPeF34uhB3ztnpdHP4UMLRnvlfuC",
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270",
          fullname: "seller1",
          email: "seller1@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 2,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullname: "seller2",
          email: "seller2@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 2,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullname: "seller3",
          email: "seller3@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 2,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullname: "buyer1",
          email: "buyer1@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "995bbc66-6a28-43a0-9467-30036542420c",
          fullname: "Notification test",
          email: "buyer5@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 2,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullname: "buyer2",
          email: "buyer2@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 3,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "32cc953f-38f9-4979-b620-cded5304a0a6",
          fullname: "buyer3",
          email: "buyer3@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 3,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "32cc953f-38f9-4979-b620-cded5304a0a9",
          fullname: "buyer to disable",
          email: "buyer4@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 3,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullname: "guest",
          email: "guest@gmail.com",
          // the hashed password below is 'Password@123'
          password:
            "$2a$12$HMeUAdojJhb0rntu4OnoDOjjRbkjwZgbf5PfVYdjjbgPs4rURhhjK",
          roleId: 3,
          accountStatus: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
