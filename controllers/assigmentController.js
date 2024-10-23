import Assignment from '../models/assignmentModel.js';
import Folder from '../models/folderModels.js';
import Class from '../models/classModels.js';  // Adjust the path as needed
import cloudinary from '../config/cloudiary.js';
import fs from 'fs';


export const submitAssignment = async (req, res) => {
  const { classId, folderId } = req.params;
  const { title, description } = req.body;
  const studentId = req.user.id;
  let fileUrl = null;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'assignments',
        resource_type: 'auto'
      });
      fileUrl = result.secure_url;

      // Delete local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }

    const assignment = await Assignment.create(title, description, fileUrl, folderId, studentId);
    
    res.status(201).json({
      message: "Assignment submitted successfully",
      assignment: assignment
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "An error occurred while submitting the assignment", error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description } = req.body;
  const studentId = req.user.id;
  let fileUrl = null;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.student_id !== studentId) {
      return res.status(403).json({ message: "You are not authorized to update this assignment" });
    }

    if (req.file) {
      if (assignment.file_url) {
        const publicId = assignment.file_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'assignments',
        resource_type: 'auto'
      });
      fileUrl = result.secure_url;
      // Delete the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }

    const updatedAssignment = await Assignment.update(assignmentId, title, description, fileUrl || assignment.file_url);
    
    res.status(200).json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "An error occurred while updating the assignment", error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.user.id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.student_id !== studentId) {
      return res.status(403).json({ message: "You are not authorized to delete this assignment" });
    }

    // Delete file from Cloudinary if exists
    if (assignment.file_url) {
      const publicId = assignment.file_url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Assignment.delete(assignmentId);
    
    res.status(200).json({
      message: "Assignment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "An error occurred while deleting the assignment", error: error.message });
  }
};



export const getSubmittedAssignments = async (req, res) => {
  const { classId } = req.params;
  const studentId = req.user.id;

  try {
    const assignments = await Assignment.findByStudentAndClass(studentId, classId);
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching submitted assignments:", error);
    res.status(500).json({ message: "An error occurred while fetching assignments", error: error.message });
  }
};

export const getAssignmentsByFolder = async (req, res) => {
  const { folderId } = req.params;
  const teacherId = req.user.id;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const classData = await Class.findById(folder.class_id);
    if (classData.teacher_id !== teacherId) {
      return res.status(403).json({ message: "You are not authorized to view these assignments" });
    }

    const assignments = await Assignment.findByFolderId(folderId);
    
    res.status(200).json({
      message: "Assignments retrieved successfully",
      assignments: assignments
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "An error occurred while fetching the assignments", error: error.message });
  }
};

export const gradeAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { grade, comment } = req.body; 
  const teacherId = req.user.id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const folder = await Folder.findById(assignment.folder_id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const classData = await Class.findById(folder.class_id);
    if (classData.teacher_id !== teacherId) {
      return res.status(403).json({ message: "You are not authorized to grade this assignment" });
    }

    const updatedAssignment = await Assignment.updateGradeAndComment(assignmentId, grade, comment);
    
    res.status(200).json({
      message: "Assignment graded successfully",
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error("Error grading assignment:", error);
    res.status(500).json({ message: "An error occurred while grading the assignment", error: error.message });
  }
};