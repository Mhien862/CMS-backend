import { Router } from "express";
import { createAcademicYear, getAcademicYears  } from "../controllers/academicYearController.js";
import { 
    createSemester, 
    getSemestersByYear ,
    getClassesBySemester
  } from "../controllers/semesterController.js";
import { admin } from "../middleware/authMiddleware.js"; // Middleware kiểm tra quyền admin

const academicYearRouter = Router();

// Tạo một năm học mới
academicYearRouter.post("/create-acaYear", admin, createAcademicYear);

// Lấy danh sách tất cả các năm học
academicYearRouter.get("/get-acaYear", admin, getAcademicYears);

academicYearRouter.post("/semesters", admin, createSemester); // Tạo học kỳ
academicYearRouter.get("/semesters/year/:academicYearId", admin, getSemestersByYear);

academicYearRouter.get("/semester/:semesterId", admin, getClassesBySemester);


export default academicYearRouter;
