'use strict';

let seedPRs = [];

for (let i = 1; i <= 20; i++) {
  seedPRs.push({
    id: i,
    userId: Math.floor(Math.random() * (50 - 40 + 1) + 40), // random between 40~50
    title: `Performance review example ${i}`,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nisi non nunc ultrices tristique. Integer non ex turpis. Aliquam aliquet lacus ut leo lacinia cursus. Sed dapibus, lectus quis tempus condimentum, sapien lectus iaculis magna, non sollicitudin risus turpis a tellus. In hac habitasse platea dictumst. Praesent neque diam, cursus vitae pharetra at, ultricies non erat. Fusce rutrum, arcu et sodales convallis, velit magna sollicitudin magna, ac facilisis nibh erat vitae lacus. Mauris sed sapien nibh. Vivamus at ultricies est.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('PerformanceReviews', seedPRs);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('PerformanceReviews', null, {});
  },
};
