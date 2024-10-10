import { Router } from 'express';
import { admin } from '../middleware/authMiddleware.js';
import { getAllFaculties, createFaculty, updateFaculty} from '../controllers/facultyController.js';

const router = Router();


router.get('/listFaculty',admin ,getAllFaculties);
router.post('/createFaculty',admin ,createFaculty);
router.put('/update/:id',admin ,updateFaculty);


export default router;