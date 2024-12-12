import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import Class from '../models/classModels.js';
import Folder from '../models/folderModels.js';
import StudentClasses from '../models/studentClassesModel.js';

export const createClass = async (req, res) => {
    try {
        const data = await Class.create(req.body);
        res.status(201).json({ message: "Class created successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to create class", error: error.message });
    }
};

export const getClassesBySemester = async (req, res) => {
    try {
        const data = await Class.getBySemester(req.params.semesterId);
        res.status(200).json({ message: "Classes retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch classes", error: error.message });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const data = await Class.getAllClasses();
        res.status(200).json({ message: "Classes retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ 
            message: "An error occurred while fetching classes",
            error: error.message 
        });
    }
};

export const getClassById = async (req, res) => {
    try {
        const data = await Class.getClassWithDetails(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Get class information successfully", data });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching class information",
            error: error.message
        });
    }
};

export const updateClass = async (req, res) => {
    try {
        const data = await Class.updateClass(req.params.id, req.body);
        if (!data) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class updated successfully", data });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the class",
            error: error.message
        });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const data = await Class.deleteClass(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class deleted successfully", data });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the class",
            error: error.message
        });
    }
};

export const getAvailableTeachers = async (req, res) => {
    try {
        const data = await Class.getAvailableTeachers(req.params.faculty_id);
        res.status(200).json({ message: "Available teachers retrieved successfully", data });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching available teachers",
            error: error.message
        });
    }
};

export const initializeClassesTable = async (req, res) => {
    try {
        await Class.createTable();
        res.status(200).json({ message: "Classes table initialized successfully" });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while initializing the classes table",
            error: error.message
        });
    }
};

export const teacherCheckClass = async (req, res) => {
    let classId, teacherId;

    if (req.body.teacherId && typeof req.body.teacherId === 'object') {
        ({ classId, teacherId } = req.body.teacherId);
    } else if (req.body.teacherId && typeof req.body.teacherId === 'string') {
        ({ classId, teacherId } = JSON.parse(req.body.teacherId));
    } else {
        ({ classId, teacherId } = req.body);
    }

    if (!classId || !teacherId) {
        return res.status(400).json({ message: "Missing classId or teacherId" });
    }

    try {
        const classData = await Class.getClassWithDetails(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        const isTeacher = classData.teacher_id === parseInt(teacherId);
        res.status(200).json({
            message: isTeacher ? "You are the teacher of this class" : "You are not the teacher of this class",
            isTeacher,
            classDetails: isTeacher ? classData : undefined
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while checking the class",
            error: error.message
        });
    }
};

export const createFolder = async (req, res) => {
    try {
        const folder = await Folder.create(req.body.name, req.params.classId, req.user.id);
        res.status(201).json({ message: 'Folder created successfully', folder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create folder', error: error.message });
    }
};

export const getFoldersByClassId = async (req, res) => {
    const { classId } = req.params;
    const { id: userId } = req.user;

    try {
        const classData = await Class.findById(classId);
        if (!classData || classData.teacher_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to view folders in this class" });
        }

        const folders = await Folder.findByClassId(classId);
        res.status(200).json({ message: "Folders retrieved successfully", folders });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching folders",
            error: error.message
        });
    }
};

export const joinClass = async (req, res) => {
    const { classId } = req.params;
    const { password } = req.body;
    const studentId = req.user.id;

    try {
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        const existingEnrollment = await StudentClasses.findByStudentAndClass(studentId, classId);

        
        if (!existingEnrollment || existingEnrollment.class_password !== classData.password) {
            
            if (password !== classData.password) {
                return res.status(402).json({ message: "Incorrect password" });
            }

            
            if (existingEnrollment) {
                await StudentClasses.updatePassword(studentId, classId, password);
            } else {
                
                await StudentClasses.create(studentId, classId, password);
            }

            return res.status(200).json({ 
                message: "Successfully joined the class",
                alreadyJoined: false
            });
        }

        
        return res.status(200).json({ 
            message: "Already joined the class",
            alreadyJoined: true 
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while joining the class",
            error: error.message
        });
    }
};

export const checkEnrollmentStatus = async (req, res) => {
    try {
        const enrollment = await StudentClasses.findByStudentAndClass(
            req.user.id,
            req.params.classId
        );
        res.status(200).json({
            isEnrolled: !!enrollment,
            enrollmentDetails: enrollment || undefined
        });
    } catch (error) {
        res.status(500).json({
            message: "Error checking enrollment status",
            error: error.message
        });
    }
};

export const getFoldersForStudent = async (req, res) => {
    const { classId } = req.params;
    const studentId = req.user.id;

    try {
        const isEnrolled = await StudentClasses.isStudentInClass(studentId, classId);
        if (!isEnrolled) {
            return res.status(403).json({ message: "You are not enrolled in this class" });
        }

        const folders = await Folder.findByClassId(classId);
        res.status(200).json({ message: "Folders retrieved successfully", folders });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching folders",
            error: error.message
        });
    }
};

export const getStudentsInClass = async (req, res) => {
    try {
        const students = await StudentClasses.getClassStudentsWithDetails(req.params.classId);
        res.status(200).json({ message: "Students retrieved successfully", data: students });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching students",
            error: error.message
        });
    }
};

export const getClassesByTeacherId = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const classes = await Class.getClassesByTeacherId(teacherId);
        return res.status(200).json({
            message: "Teacher's classes retrieved successfully",
            data: classes
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching teacher's classes",
            error: error.message
        });
    }
};

export const getClassesByFaculty = async (req, res) => {
    const { facultyId } = req.params;
    try {
        const classes = await Class.getClassesByFaculty(facultyId);
        
        if (classes.length === 0) {
            return res.status(404).json({
                message: "No classes found for this faculty"
            });
        }

        return res.status(200).json({
            message: "Classes retrieved successfully",
            data: classes
        });
    } catch (error) {
        console.error('Error in getClassesByFaculty:', error);
        return res.status(500).json({
            message: "An error occurred while fetching classes",
            error: error.message
        });
    }
};

export const getStudentClasses = async (req, res) => {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
    }

    try {
        const studentClasses = await StudentClasses.getStudentClassesWithDetails(studentId);
        const teacherClasses = studentClasses.filter(c => c.teacher_id === teacherId);

        if (teacherClasses.length === 0) {
            return res.status(403).json({
                message: "This student is not in any of your classes"
            });
        }

        res.status(200).json({
            message: "Student classes retrieved successfully",
            data: teacherClasses
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch student classes",
            error: error.message
        });
    }
};



