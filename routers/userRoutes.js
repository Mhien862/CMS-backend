import {  getListUser, getInformationUser, getRole, deleteUser,updateUser,getFaculty, updateUserStatus, listTeacher, getMe } from '../controllers/userController.js';
import { Router } from 'express';
import { admin } from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { set } from 'mongoose';




const router = Router();

/**
 * @swagger
 * /user/listUser:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/listUser',admin ,getListUser);

/**
 * @swagger
 * /user/information/{userId}:
 *   get:
 *     summary: Get user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/information/:userId', getInformationUser);

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a single user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// router.get('/:userId', getOne);

router.get('/getRole',admin, getRole);
router.get('/getFaculty',admin, getFaculty);
router.delete('/deleteUser/:userId',admin, deleteUser);
router.put('/updateUser/:userId',admin, updateUser);
router.put('/:userId/status',admin, updateUserStatus);
router.get('/listTeacher',admin, listTeacher);
router.get('/me', getMe);
 

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           format: email
 *           description: The user email
 *         role:
 *           type: string
 *           description: The user role
 */