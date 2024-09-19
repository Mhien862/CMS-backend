import { getOne } from '../controllers/userController.js';
import { getListUser } from '../controllers/userController.js';
import { Router } from 'express';
import { admin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:userId', getOne);
router.get('/listUser', getListUser, admin);
export default router;

