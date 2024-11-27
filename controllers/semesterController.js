import { pool } from '../config/db.js'; 
import Semester from "../models/semesterModel.js";

export const createSemester = async (req, res) => {
    try {
        const data = await Semester.create(req.body);
        res.status(201).json({ message: "Semester created successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to create semester", error: error.message });
    }
};

export const getSemestersByYear = async (req, res) => {
    try {
        const data = await Semester.getByYear(req.params.academicYearId);
        res.status(200).json({ message: "Semesters retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch semesters", error: error.message });
    }
};

export const getClassesBySemester = async (req, res) => {
    const { semesterId } = req.params;
    try {
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
            WHERE c.semester_id = $1
        `;
        const result = await pool.query(query, [semesterId]);
        return res.status(200).json({
            message: "Classes retrieved successfully",
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch classes",
            error: error.message,
        });
    }
};

