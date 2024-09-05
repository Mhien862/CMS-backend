import { getOne } from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();
router.get('/:userId', getOne);

export default router;

