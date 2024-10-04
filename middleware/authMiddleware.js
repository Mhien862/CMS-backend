import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
 
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      console.log(req.user)
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

const admin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 1) {
      return res.status(403).json({ message: "Access denied. Admin rights required." });
    }
console.log(decoded.role);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminRegister = (req, res, next) => {
    const adminKey = req.headers['admin-key'] || req.body.adminKey;
    
    if (adminKey && adminKey === process.env.ADMIN_REGISTER_KEY) {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized to register new users');
    }
  };
  

  export { protect, admin, adminRegister };

