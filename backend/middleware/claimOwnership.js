// middleware/claimOwnership.js
export const validateClaimOwnership = async (req, res, next) => {
    try {
      const claim = await Claim.findById(req.params.id);
      
      if (!claim) return res.status(404).json({ message: 'Claim not found' });
      
      if (claim.userId.toString() !== req.user.userId.toString() && req.user.role !== 'insurer') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };