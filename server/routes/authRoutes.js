const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {  User, UserRole, Role, RolePermission , ProjectRoleAssignment} = require('../models');
const { authenticateJWT, generateToken, removeToken } = require('../middlewares/auth');
const secret = `secret`;

// User login
router.post('/login', async (req, res) => {
   const { username, password } = req.body;
 
   try {
     // Fetch user by username
     const user = await User.findOne({ where: { username } });
     if (!user) {
       return res.status(401).json({ error: 'User not found' });
     }
 
     // Verify password
     const passwordMatch = await bcrypt.compare(password, user.password);
     if (!passwordMatch) {
       return res.status(401).json({ error: 'Invalid credentials' });
     }
 
     // Generate JWT Token
     const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
 
     res.status(200).json({ token });
   } catch (error) {
     console.error('Login error:', error);
     res.status(500).json({ error: 'An error occurred during login.' });
   }
 });
 

router.post('/logout', authenticateJWT, async (req, res) => {
   try {
     const user = await User.findByPk(req.user.id);
     if (!user) {
       return res.status(404).json({ message: 'User not found.' });
     }
 
     // Clear the token in the database
     user.token = null;
     await user.save();
 
     res.status(200).json({ message: 'User logged out successfully' });
   } catch (error) {
     res.status(500).json({ error: 'Logout failed', details: error.message });
   }
 });


 router.post('/verify-token', async (req, res) => {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
     return res.status(401).json({ message: 'No token provided.' });
   }
 
   const token = authHeader.split(' ')[1];
 
   try {
     const decoded = jwt.verify(token, secret);
     const userId = decoded.id;
 
     // Fetch user's roles and permissions from the database
     const user = await User.findByPk(userId, {
       include: [
         {
           model: UserRole,
           as: 'UserRoles',
           include: {
             model: Role,
             as: 'Role',
             include: {
               model: RolePermission,
               as: 'Permissions'
             }
           }
         }
       ]
     });
 
     if (!user) {
       return res.status(401).json({ message: 'Invalid token. User not found.' });
     }
 
     // Extract permissions
     const permissions = user.UserRoles.map(userRole => userRole.Role.Permissions.map(permission => permission.name)).flat();
 
     res.status(200).json({ valid: true, permissions });
   } catch (error) {
     console.error('Token verification error:', error.message);
     return res.status(401).json({ message: 'Invalid token or expired.' });
   }
 });
 

module.exports = router;
