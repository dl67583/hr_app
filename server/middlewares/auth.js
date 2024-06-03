const jwt = require('jsonwebtoken');
const { User, Role, RolePermission } = require('../models');
const secret = "test";
const refreshTokenSecret = "refresh-token-secret";

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
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, refreshTokenSecret, { expiresIn: '' });
  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();
  return { token, refreshToken };
};

const removeToken = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    user.token = null;
    user.refreshToken = null;
    await user.save();
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Access denied. No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newToken = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(400).json({ message: 'Invalid refresh token.' });
  }
};

module.exports = {
  authenticateJWT,
  checkPermissions,
  generateToken,
  removeToken,
  refreshToken
};