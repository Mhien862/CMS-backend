import Semester from "../models/semesterModel.js";

export const createSemester = async (req, res) => {
    try {
        const data = await Semester.create(req.body);
        res.status(201).json({ 
            message: "Semester created successfully", 
            data 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to create semester", 
            error: error.message 
        });
    }
};

export const getSemestersByYear = async (req, res) => {
    try {
        const data = await Semester.getByYear(req.params.academicYearId);
        res.status(200).json({ 
            message: "Semesters retrieved successfully", 
            data 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to fetch semesters", 
            error: error.message 
        });
    }
};

export const getClassesBySemester = async (req, res) => {
    try {
        const data = await Semester.getClassesWithDetails(req.params.semesterId);
        return res.status(200).json({
            message: "Classes retrieved successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch classes",
            error: error.message
        });
    }
};