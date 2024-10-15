import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import {pool} from '../config/db.js';

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

export const teacher = async (req, res, next) => {
  console.log('Teacher middleware started');
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    console.log('Decoding token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    if (decoded.role !== 2) {
      console.log('User is not a teacher. Role:', decoded.role);
      return res.status(403).json({ message: "Access denied. Teacher rights required." });
    }

    const classId = req.params.classId;
    console.log('ClassId from params:', classId);

    if (classId) {
      console.log('Checking if teacher is assigned to class');
      const query = 'SELECT * FROM classes WHERE id = $1 AND teacher_id = $2';
      const result = await pool.query(query, [classId, decoded.id]);
      console.log('Query result:', result.rows);

      if (result.rows.length === 0) {
        console.log(`Teacher (ID: ${decoded.id}) not assigned to class (ID: ${classId})`);
        return res.status(403).json({ message: "Access denied. You are not assigned to this class." });
      }
    }

    console.log('Teacher verification successful');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const student = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 3) {
      return res.status(403).json({ message: "Access denied. Student rights required." });
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
  

  export { protect, admin, adminRegister, student };

