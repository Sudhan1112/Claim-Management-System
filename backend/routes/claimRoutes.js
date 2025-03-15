// routes/claimRoutes.js
import { Router } from "express";
import multer from "multer";
import { getClaims, getUserClaims, submitClaim, updateClaim } from "../controllers/claimController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ dest: "uploads/" });

// Complete routes
router.post("/submit", authMiddleware, upload.single("document"), submitClaim);
router.get("/all", authMiddleware, getClaims);
router.get("/user", authMiddleware, getUserClaims);
router.put("/:id", authMiddleware, updateClaim);

export default router;