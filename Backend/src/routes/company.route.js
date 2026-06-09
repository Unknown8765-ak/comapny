import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getMyCompany,
  getCompanyDashboard
} from "../controllers/company.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",verifyJWT, createCompany);             
router.get("/me",verifyJWT,getMyCompany);     
router.get("/",verifyJWT, getAllCompanies);             
router.get("/:id/dashboard",verifyJWT,getCompanyDashboard);
router.get("/:id",verifyJWT, getCompanyById);            
router.put("/:id",verifyJWT, updateCompany);         
router.delete("/:id",verifyJWT, deleteCompany);

export default router;