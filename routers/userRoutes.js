import { getOne } from '../controllers/userController.js';
import { getListUser } from '../controllers/userController.js';
import { Router } from 'express';
import { admin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/listUser', getListUser, admin);
router.get('/:userId', getOne);
export default router;

