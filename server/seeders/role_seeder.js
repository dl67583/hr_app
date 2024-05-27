module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Roles', [
        {
          name: 'superadmin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'hr',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'regular',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Roles', null, {});
    }
  };
  