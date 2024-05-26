module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Permissions', [
        {
          name: 'READ',
          description: 'Read permission',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'WRITE',
          description: 'Write permission',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // Add more permissions as needed
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Permissions', null, {});
    }
  };
  