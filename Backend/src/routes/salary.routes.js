import express from "express";
import {
  generateSalary,
  getMySalary,
  getAllSalaries,
  markSalaryPaid,
  getEmployeeSalaryDetails
} from "../controllers/salary.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/generate", verifyJWT,generateSalary);
router.get("/me", verifyJWT, getMySalary);
router.get("/", verifyJWT,getAllSalaries);
router.patch("/pay/:id",verifyJWT, markSalaryPaid);
router.get("/employee/:id",verifyJWT,getEmployeeSalaryDetails);


export default router; 