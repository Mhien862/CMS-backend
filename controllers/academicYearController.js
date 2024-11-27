import AcademicYear from "../models/academicYearModel.js";

export const createAcademicYear = async (req, res) => {
    try {
        const data = await AcademicYear.create(req.body);
        res.status(201).json({ message: "Academic year created successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to create academic year", error: error.message });
    }
};

export const getAcademicYears = async (req, res) => {
    try {
        const data = await AcademicYear.getAll();
        res.status(200).json({ message: "Academic years retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch academic years", error: error.message });
    }
};
