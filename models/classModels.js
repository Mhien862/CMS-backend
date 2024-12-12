import { pool } from "../config/db.js";

const Class = {
    
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                faculty_id INTEGER REFERENCES faculties(id),
                teacher_id INTEGER REFERENCES users(id),
                password VARCHAR(255) NOT NULL,
                semester_id INTEGER REFERENCES semesters(id)
            )
        `;
        await pool.query(query);
    },

   
    async create(classData) {
        const { name, faculty_id, teacher_id, password, semester_id } = classData;
        const query = `
            INSERT INTO classes (name, faculty_id, teacher_id, password, semester_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [name, faculty_id, teacher_id, password, semester_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getBySemester(semesterId) {
        const query = `
            SELECT c.*, s.name AS semester_name, ay.name AS academic_year_name
            FROM classes c
            LEFT JOIN semesters s ON c.semester_id = s.id
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semesterId]);
        return result.rows;
    },

  
    async findById(id) {
        const query = 'SELECT * FROM classes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

   
    async getAllClasses() {
        const query = `
            SELECT 
            c.*,
            f.name AS faculty_name,
            u.username AS teacher_name,
            s.name AS semester_name,
            ay.name AS academic_year_name
        FROM classes c
        LEFT JOIN faculties f ON c.faculty_id = f.id
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN semesters s ON c.semester_id = s.id
        LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
        ORDER BY c.id ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

 
    async updateClass(id, updateData) {
        const { name, faculty_id, teacher_id, semester_id, password } = updateData;
        let query;
        let values;
    
        if (password) {
            query = `
                UPDATE classes
                SET name = $1, 
                    faculty_id = $2, 
                    teacher_id = $3, 
                    semester_id = $4,
                    password = $5
                WHERE id = $6
                RETURNING *
            `;
            values = [name, faculty_id, teacher_id, semester_id, password, id];
        } else {
            query = `
                UPDATE classes
                SET name = $1, 
                    faculty_id = $2, 
                    teacher_id = $3, 
                    semester_id = $4
                WHERE id = $5
                RETURNING *
            `;
            values = [name, faculty_id, teacher_id, semester_id, id];
        }
    
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    

 
    async deleteClass(id) {
        const query = 'DELETE FROM classes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

   
    async getAvailableTeachers(faculty_id) {
        const query = `
            SELECT * FROM users
            WHERE role_id = 2 AND faculty_id = $1
        `;
        const result = await pool.query(query, [faculty_id]);
        return result.rows;
    },

    async getClassWithDetails(id) {
        const query = `
SELECT 
            c.*,
            f.name AS faculty_name,
            u.username AS teacher_name,
            s.name AS semester_name,
            ay.name AS academic_year_name,
            s.id AS semester_id,
            ay.id AS academic_year_id
        FROM classes c
        LEFT JOIN faculties f ON c.faculty_id = f.id
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN semesters s ON c.semester_id = s.id
        LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
        WHERE c.id = $1
    `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },


    async getClassesBySemester(semester_id) {
        const query = `
            SELECT 
                c.*, 
                f.name AS faculty_name, 
                u.username AS teacher_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semester_id]);
        return result.rows;
    },

    async getClassesByTeacherId(teacherId) {
        const query = `
            SELECT c.*, f.name AS faculty_name
            FROM classes c
            LEFT JOIN faculties f ON c.faculty_id = f.id
            WHERE c.teacher_id = $1
        `;
        const result = await pool.query(query, [teacherId]);
        return result.rows;
    },
   
async getStudentClassesWithDetails(studentId) {
    const query = `
        SELECT 
            c.name AS class_name,
            u.username AS teacher_name,
            c.teacher_id,  
            sc.joined_at,
            ROUND(AVG(CASE WHEN a.grade IS NOT NULL THEN a.grade ELSE null END)::numeric, 2) as average_grade
        FROM student_classes sc
        JOIN classes c ON sc.class_id = c.id
        JOIN users u ON c.teacher_id = u.id
        LEFT JOIN assignments a ON a.student_id = sc.student_id AND a.folder_id IN (
            SELECT id FROM folders WHERE class_id = c.id
        )
        WHERE sc.student_id = $1
        GROUP BY c.name, u.username, c.teacher_id, sc.joined_at, c.id
        ORDER BY sc.joined_at DESC
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
},

async getClassesByFaculty(facultyId) {
    const query = `
        SELECT 
            c.*,
            f.name AS faculty_name,
            u.username AS teacher_name,
            s.name AS semester_name,
            ay.name AS academic_year_name
        FROM classes c
        LEFT JOIN faculties f ON c.faculty_id = f.id
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN semesters s ON c.semester_id = s.id
        LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
        WHERE c.faculty_id = $1
    `;
    const result = await pool.query(query, [facultyId]);
    return result.rows;
},
};


export default Class;
