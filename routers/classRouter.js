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
  getFoldersForStudent,
  checkEnrollmentStatus,
  getStudentsInClass,
  getStudentClasses
} from '../controllers/classController.js';
import { submitAssignment,getAssignmentsByFolder, updateAssignment,deleteAssignment, getSubmittedAssignments, gradeAssignment, getStudentsGradesInClass } from '../controllers/assigmentController.js';
import { getClassesBySemester } from '../controllers/semesterController.js';
import { admin, protect, teacher,student } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';




const router = Router();





router.get('/:classId/students/grades', teacher, getStudentsGradesInClass);
router.get('/students/:studentId/classes', teacher, getStudentClasses);


router.post('/create', admin, createClass);
router.get('/listClasses', admin, getAllClasses);
router.get('/:id', getClassById);
router.get('/availableTeachers/:facultyId', admin, getAvailableTeachers);
router.put('/updateClass/:id', admin, updateClass);
router.delete('/deleteClass/:id', admin, deleteClass);
router.get('/teacher/:teacherId', teacher, getClassesByTeacherId);
router.post('/teacherCheckClass', teacher, teacherCheckClass);




router.post('/:classId/createFolder', teacher, createFolder);


 
router.get('/:classId/folders', teacher, getFoldersByClassId);
router.post('/:classId/folders/:folderId/assignments',
  student,
  upload.single('file'),
  submitAssignment
);


router.get('/:classId/folders/:folderId/assignments', teacher, getAssignmentsByFolder);
router.put('/:classId/assignments/:assignmentId/grade', teacher, gradeAssignment);


router.put('/:classId/folders/:folderId/assignments/:assignmentId', student, upload.single('file'), updateAssignment);
router.get('/:classId/folders/:folderId/assignmentStudent', student, getSubmittedAssignments);

router.delete('/:classId/folders/:folderId/assignments/:assignmentId', student, deleteAssignment);
router.get('/faculty/:facultyId/classes', student, getClassesByFaculty);
router.post('/:classId/join', student, joinClass);
router.get('/:classId/enrollment-status', student, checkEnrollmentStatus);
router.get('/:classId/FolderStudent', student, getFoldersForStudent);

router.get('/:classId/students',teacher ,getStudentsInClass);

router.get('/:classId/students/grades',teacher ,getStudentsGradesInClass);

router.get("/semester/:semesterId", admin, getClassesBySemester);








export default router;

