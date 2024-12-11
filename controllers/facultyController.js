import Faculty from '../models/facultyModels.js';

export const getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.findAll();
        return res.status(200).json({
            message: "Faculties retrieved successfully",
            data: faculties
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching faculties",
            error: error.message
        });
    }
};

export const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty = await Faculty.findById(id);
        
        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty retrieved successfully",
            data: faculty
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching the faculty",
            error: error.message
        });
    }
};

export const createFaculty = async (req, res) => {
    try {
        const { name } = req.body;
        const faculty = await Faculty.create(name);

        return res.status(201).json({
            message: "Faculty created successfully",
            data: faculty
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating the faculty",
            error: error.message
        });
    }
};

export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const faculty = await Faculty.update(id, name);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty updated successfully",
            data: faculty
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the faculty",
            error: error.message
        });
    }
};

export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty = await Faculty.delete(id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            message: "Faculty deleted successfully",
            data: faculty
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the faculty",
            error: error.message
        });
    }
};