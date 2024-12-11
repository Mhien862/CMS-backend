import { Router } from 'express';
import { admin , student } from '../middleware/authMiddleware.js';
import { getAllFaculties, createFaculty, updateFaculty, deleteFaculty} from '../controllers/facultyController.js';


const router = Router();


router.get('/listFaculty',admin ,getAllFaculties);
router.post('/createFaculty',admin ,createFaculty);
router.put('/update/:id',admin ,updateFaculty);
router.delete('/delete/:id',admin ,deleteFaculty);



export default router;