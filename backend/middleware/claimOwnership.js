// middleware/claimOwnership.js
import mongoose from 'mongoose';
import Claim from '../models/claimModel.js';

export const validateClaimOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid claim ID format' });
    }
    
    const claim = await Claim.findById(id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    if (claim.userId.toString() !== req.user.userId.toString() && req.user.role !== 'insurer') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Add claim to request for the next middleware/controller
    req.claim = claim;
    next();
  } catch (error) {
    console.error('Claim ownership validation error:', error);
    res.status(500).json({ message: 'Server error validating claim ownership' });
  }
};