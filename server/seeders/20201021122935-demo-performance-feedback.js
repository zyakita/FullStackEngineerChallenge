'use strict';

const { PB_STATUS_SUBMITTED } = require('../constants/pb.status.constant');

let seedPBs = [];

for (let i = 1; i <= 20; i++) {
  seedPBs.push({
    id: i,
    prId: Math.floor(Math.random() * (5 - 1 + 1) + 1), // random between 1~5
    userId: Math.floor(Math.random() * (10 - 2 + 1) + 2), // random between 2~10
    content: `Vestibulum sed arcu non odio euismod lacinia at quis. Quis risus sed vulputate odio ut enim. Urna cursus eget nunc scelerisque viverra mauris. Diam vel quam elementum pulvinar etiam non quam lacus. Vel eros donec ac odio tempor orci dapibus ultrices. Facilisi morbi tempus iaculis urna id. `,
    status: PB_STATUS_SUBMITTED,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('PerformanceFeedbacks', seedPBs);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('PerformanceFeedbacks', null, {});
  },
};
