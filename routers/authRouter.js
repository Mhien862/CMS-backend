import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { protect, admin, adminRegister } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', login, protect);
router.post('/register', register, protect, admin, adminRegister);

export default router;

