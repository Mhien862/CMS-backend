import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ id đã được decode, trừ password
      req.user = await User.findById(decoded.id).select('-password');

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
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// ... các import và middleware khác ...

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

