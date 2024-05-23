const { User } = require('../models'); 


exports.createUser = async (req, res) => {
  const {name, surname, email,password, username} = req.body
  try {
    if (await User.findOne({ where:  {email: email}  })) {
      return res.status(400).json({ message: 'Email address already exists' });
    }
    if (await User.findOne({ where:  {username: username}  })) {
      return res.status(400).json({ message: 'Username address already exists' });
    }
    if (!name || !email || !password || !username ||!surname ) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
   
    // Replace null values with undefined to prevent Sequelize from ignoring them
    const requestBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, value === "" ? undefined : value])
    );

    const user = await User.create(requestBody);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (await User.findOne({ where:  email  })) {
      return res.status(400).json({ message: 'Email address already exists' });
    }
    if (await User.findOne({ where:  username  })) {
      return res.status(400).json({ message: 'Username address already exists' });
    }
    if (!name || !email || !password || !username || !surname ) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
   
    // Replace null values with undefined to prevent Sequelize from ignoring them
    const requestBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, value === "" ? undefined : value])
    );
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
