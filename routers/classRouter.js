import { Router } from 'express';
import { createClass, getAvailableTeachers, getAllClasses, updateClass, deleteClass, getClassById, getClassesByTeacherId  } from '../controllers/classController.js';
import { admin, protect, teacher } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /class/create:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassInput'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/create', admin, createClass);

/**
 * @swagger
 * /class/listClasses:
 *   get:
 *     summary: Get list of classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/listClasses', admin, getAllClasses);

/**
 * @swagger
 * /class/information/{classId}:
 *   get:
 *     summary: Get class information
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 */
router.get('/:id', getClassById);

/**
 * @swagger
 * /class/availableTeachers/{facultyId}:
 *   get:
 *     summary: Get available teachers for a faculty
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: facultyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/availableTeachers/:facultyId', admin, getAvailableTeachers);

/**
 * @swagger
 * /class/updateClass/{classId}:
 *   put:
 *     summary: Update a class
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
 *             $ref: '#/components/schemas/ClassUpdate'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 */
router.put('/updateClass/:id', admin, updateClass);

/**
 * @swagger
 * /class/deleteClass/{classId}:
 *   delete:
 *     summary: Delete a class
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
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete('/deleteClass/:id', admin, deleteClass);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - faculty_id
 *         - teacher_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the class
 *         name:
 *           type: string
 *           description: The name of the class
 *         faculty_id:
 *           type: string
 *           description: The id of the faculty
 *         teacher_id:
 *           type: string
 *           description: The id of the teacher
 *     ClassInput:
 *       type: object
 *       required:
 *         - name
 *         - faculty_id
 *         - teacher_id
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         faculty_id:
 *           type: string
 *         teacher_id:
 *           type: string
 *         password:
 *           type: string
 *     ClassUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         faculty_id:
 *           type: string
 *         teacher_id:
 *           type: string
 */
router.get('/information/:classId', getClassById, admin);
/**
 * @swagger
 * /class/{classId}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 */

router.get('/teacher/:teacherId',teacher, getClassesByTeacherId);