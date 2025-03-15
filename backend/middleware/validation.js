// middleware/validation.js
export const validateClaimSubmission = (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Document is required" });
    
    const { claimAmount } = req.body;
    if (!claimAmount || isNaN(claimAmount) || claimAmount <= 0) {
      return res.status(400).json({ message: "Valid claim amount required" });
    }
  
    next();
  };