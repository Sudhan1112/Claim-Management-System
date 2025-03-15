// routes/claimRoutes.js
import { Router } from "express";
import multer from "multer";
// import mongoose from 'mongoose';
import { getClaims, getUserClaims, submitClaim, updateClaim } from "../controllers/claimController.js";
import { debugClaim } from '../controllers/debugController.js';
// import { validateClaimOwnership } from '../middleware/claimOwnership.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ dest: "uploads/" });

// Debug route
router.get('/debug/:id', authMiddleware, debugClaim);

// Main routes
router.post("/submit", authMiddleware, upload.single("document"), submitClaim);
router.get('/all', authMiddleware, getClaims);
router.get('/user/:userId', authMiddleware, getUserClaims);

// Update route - simplify for debugging
router.put('/:id', authMiddleware, updateClaim);

export default router;