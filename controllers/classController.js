import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import Class from '../models/classModels.js';
import Folder from '../models/folderModels.js';

export const createClass = async (req, res) => {
    const { name, faculty_id, teacher_id, password } = req.body;
    try {
        
        const query = `
            INSERT INTO classes (name, faculty_id, teacher_id, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, password];
        const result = await pool.query(query, values);
        return res.status(201).json({
            message: "Class created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating the class",
            error: error.message
        });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const query = `
            SELECT * FROM classes ORDER BY id ASC
        `;
        const result = await pool.query(query);
        return res.status(200).json({
            message: "Classes retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching classes",
            error: error.message
        });
    }
};

export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT c.*, f.name AS faculty_name, u.username AS teacher_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Get class information successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching class information",
            error: error.message
        });
    }
};

export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, faculty_id, teacher_id, password } = req.body;
    try {
       

        const query = `
            UPDATE classes
            SET name = $1, faculty_id = $2, teacher_id = $3, password = COALESCE($4, password)
            WHERE id = $5
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, password, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Class updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the class",
            error: error.message
        });
    }
};

export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM classes
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Class deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the class",
            error: error.message
        });
    }
};

export const getAvailableTeachers = async (req, res) => {
    const { faculty_id } = req.params;
    try {
        const query = `
            SELECT * FROM users
            WHERE role_id = 2 AND faculty_id = $1
        `;
        const result = await pool.query(query, [faculty_id]);
        return res.status(200).json({
            message: "Available teachers retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching available teachers",
            error: error.message
        });
    }
};

export const initializeClassesTable = async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                faculty_id INTEGER REFERENCES faculties(id),
                teacher_id INTEGER REFERENCES users(id),
                password VARCHAR(255) NOT NULL
            )
        `;
        await pool.query(query);
        return res.status(200).json({
            message: "Classes table initialized successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while initializing the classes table",
            error: error.message
        });
    }
};

export const getClassesByTeacherId = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const query = `
            SELECT c.*, f.name AS faculty_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            WHERE c.teacher_id = $1
        `;
        const result = await pool.query(query, [teacherId]);
        return res.status(200).json({
            message: "Teacher's classes retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching teacher's classes",
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
        const query = `
            SELECT c.*, f.name AS faculty_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            WHERE c.id = $1
        `;
        const result = await pool.query(query, [classId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Class not found" });
        }
        
        const classData = result.rows[0];
        const isTeacher = classData.teacher_id === parseInt(teacherId);
        
        return res.status(200).json({ 
            message: isTeacher ? "You are the teacher of this class" : "You are not the teacher of this class",
            isTeacher,
            classDetails: isTeacher ? classData : undefined
        });
    } catch (error) {
        console.error('Error in teacherCheckClass:', error);
        return res.status(500).json({
            message: "An error occurred while checking the class",
            error: error.message
        });
    }
};



export const createFolder = async (req, res) => {
  console.log('CreateFolder controller started');
  const { classId } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  console.log(`Attempting to create folder "${name}" for class ${classId} by user ${userId}`);

  try {
    const query = 'INSERT INTO folders (name, class_id, created_by) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, classId, userId]);
    
    console.log('Folder created:', result.rows[0]);
    res.status(201).json({
      message: 'Folder created successfully',
      folder: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    if (error.code === '42P01') {
      res.status(500).json({ message: 'Database error: Folders table does not exist', error: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create folder', error: error.message });
    }
  }
};

export const getFoldersByClassId = async (req, res) => {
    const { classId } = req.params;
    const { id: userId, role_id } = req.user;

    console.log(`Attempting to get folders for classId: ${classId}`);
    console.log(`User info - userId: ${userId}, role_id: ${role_id}`);

    try {
        // Kiểm tra quyền giáo viên
        

        // Kiểm tra xem giáo viên có phụ trách lớp học này không
        const checkTeacherQuery = "SELECT * FROM classes WHERE id = $1 AND teacher_id = $2";
        const teacherResult = await pool.query(checkTeacherQuery, [classId, userId]);
        console.log(`Teacher check result: ${JSON.stringify(teacherResult.rows)}`);

        if (teacherResult.rows.length === 0) {
            console.log(`Teacher (${userId}) not assigned to class (${classId})`);
            return res.status(403).json({ message: "You are not authorized to view folders in this class" });
        }

        // Sử dụng model Folder để lấy danh sách folder
        const folders = await Folder.findByClassId(classId);
        console.log(`Found ${folders.length} folders for class ${classId}`);

        // Trả về kết quả
        res.status(200).json({
            message: "Folders retrieved successfully",
            folders: folders
        });

    } catch (error) {
        console.error("Error fetching folders:", error);
        res.status(500).json({ message: "An error occurred while fetching the folders", error: error.message });
    }
};