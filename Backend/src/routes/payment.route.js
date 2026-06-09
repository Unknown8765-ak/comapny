import express from "express";

import {processPayment ,getKey ,verifyPayment} from "../controllers/payment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/process",verifyJWT,processPayment);
router.post("/verify",verifyJWT, verifyPayment);
router.get("/getkey",verifyJWT,getKey);

export default router