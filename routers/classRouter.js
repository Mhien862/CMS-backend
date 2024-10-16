import { Router } from 'express';
import { 
  createClass, 
  getAvailableTeachers, 
  getAllClasses, 
  updateClass, 
  deleteClass, 
  getClassById, 
  getClassesByTeacherId, 
  teacherCheckClass,
  createFolder,
  getFoldersByClassId,
  getClassesByFaculty,
  joinClass,
  getFoldersForStudent
} from '../controllers/classController.js';
import { submitAssignment,getAssignmentsByFolder, updateAssignment,deleteAssignment, getSubmittedAssignments, gradeAssignment } from '../controllers/assigmentController.js';
import { admin, protect, teacher,student } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';



const router = Router();


// Existing routes
router.post('/create', admin, createClass);
router.get('/listClasses', admin, getAllClasses);
router.get('/:id', getClassById);
router.get('/availableTeachers/:facultyId', admin, getAvailableTeachers);
router.put('/updateClass/:id', admin, updateClass);
router.delete('/deleteClass/:id', admin, deleteClass);
router.get('/information/:classId', getClassById, admin);
router.get('/teacher/:teacherId', teacher, getClassesByTeacherId);
router.post('/teacherCheckClass', teacher, teacherCheckClass);

// New routes for folder management
/**
 * @swagger
 * /class/{classId}/createFolder:
 *   post:
 *     summary: Create a new folder in a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Folder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 */
router.post('/:classId/createFolder', teacher, createFolder);

/**
 * @swagger
 * /class/{classId}/folders:
 *   get:
 *     summary: Get folders in a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of folders in the class
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 */
router.get('/:classId/folders', teacher, getFoldersByClassId);
router.post('/:classId/folders/:folderId/assignments',
  student,
  upload.single('file'),
  submitAssignment
);

// Get all assignments in a folder
router.get('/:classId/folders/:folderId/assignments', teacher, getAssignmentsByFolder);
router.put('/:classId/assignments/:assignmentId/grade', teacher, gradeAssignment);

// Update an existing assignment
router.put('/:classId/folders/:folderId/assignments/:assignmentId', student, upload.single('file'), updateAssignment);
router.get('/:classId/assignments', student, getSubmittedAssignments);
// Delete an assignment
router.delete('/:classId/folders/:folderId/assignments/:assignmentId', student, deleteAssignment);
router.get('/faculty/:facultyId/classes', student, getClassesByFaculty);
router.post('/:classId/join', student, joinClass);
router.get('/:classId/FolderStudent', student, getFoldersForStudent);




export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - class_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the folder
 *         name:
 *           type: string
 *           description: The name of the folder
 *         class_id:
 *           type: string
 *           description: The id of the class this folder belongs to
 */