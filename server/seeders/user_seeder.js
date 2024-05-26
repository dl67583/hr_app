module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Users', [
        {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'johndoe@example.com',
          phone: '123456789',
          password: 'password123',
          birthday: '1980-01-01',
          hourlyPay: 20.00,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // Add more users as needed
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users', null, {});
    }
  };
  