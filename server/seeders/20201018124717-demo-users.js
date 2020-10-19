'use strict';
const bcrypt = require('bcryptjs');

let seedUsers = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

for (let i = 2; i <= 50; i++) {
  seedUsers.push({
    id: i,
    name: `Example User ${i}`,
    email: `user${i}@example.com`,
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Users', seedUsers);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', null, {});
  },
};
