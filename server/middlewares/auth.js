const jwt = require('jsonwebtoken');
const { User, Role, RolePermission } = require('../models');
const secret = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { projectId, departmentId } = req.params;

      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          as: 'UserRoles'
        }]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const roleIds = user.UserRoles.map(role => role.id);
      const rolePermissions = await RolePermission.findAll({
        where: {
          roleId: roleIds,
          permission: requiredPermissions,
          projectId: projectId || null,
          departmentId: departmentId || null
        }
      });

      const hasPermission = rolePermissions.length > 0;

      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.allowedColumns = rolePermissions.reduce((acc, rp) => {
        if (rp.columns) {
          Object.keys(rp.columns).forEach(column => {
            if (!acc[column]) {
              acc[column] = rp.columns[column];
            } else {
              acc[column] = acc[column] || rp.columns[column];
            }
          });
        }
        return acc;
      }, {});

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};

const generateToken = async (user) => {
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
  user.token = token;
  await user.save();
  return token;
};

const removeToken = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    user.token = null;
    await user.save();
  }
};

module.exports = {
  authenticateJWT,
  checkPermissions,
  generateToken,
  removeToken
};
