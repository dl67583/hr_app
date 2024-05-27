module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Projects', [
        {
          name: 'Project A',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Project B',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Projects', null, {});
    }
  };
  