import { Router } from "express";
import multer from "multer";
import { getClaims, getUserClaims, submitClaim, updateClaim } from "../controllers/claimController.js";
import { validateClaimOwnership } from '../middleware/claimOwnership.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ dest: "uploads/" });

// Complete routes with proper middleware and function calls
router.post("/submit", authMiddleware, upload.single("document"), submitClaim);

// Fixed: Use the imported controller functions
router.get('/all', authMiddleware, getClaims);
router.get('/user/:userId', authMiddleware, getUserClaims);

// Fixed: Route parameter matches what's used in updateClaimStatus thunk
router.put(
    '/:id',
    authMiddleware,
    validateClaimOwnership,
    updateClaim
);

export default router;