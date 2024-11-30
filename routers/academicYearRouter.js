import { Router } from "express";
import { createAcademicYear, getAcademicYears  } from "../controllers/academicYearController.js";
import { 
    createSemester, 
    getSemestersByYear ,
    getClassesBySemester
  } from "../controllers/semesterController.js";
import { admin } from "../middleware/authMiddleware.js"; 

const academicYearRouter = Router();


academicYearRouter.post("/create-acaYear", admin, createAcademicYear);


academicYearRouter.get("/get-acaYear", admin, getAcademicYears);

academicYearRouter.post("/semesters", admin, createSemester); 
academicYearRouter.get("/semesters/year/:academicYearId", admin, getSemestersByYear);

academicYearRouter.get("/semester/:semesterId", admin, getClassesBySemester);


export default academicYearRouter;
