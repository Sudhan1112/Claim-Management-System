// controllers/debugController.js
import Claim from "../models/claimModel.js";

export const debugClaim = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Debug claim ID:', id);
    
    // Test if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid claim ID format' });
    }
    
    // Test if we can find the claim
    const claim = await Claim.findById(id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Return the claim data for debugging
    return res.status(200).json({
      message: 'Claim found',
      claim
    });
  } catch (error) {
    console.error('Debug claim error:', error);
    return res.status(500).json({
      message: 'Debug error',
      error: error.message,
      stack: error.stack
    });
  }
};