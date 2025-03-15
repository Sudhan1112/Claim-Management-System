import Claim from "../models/claimModel.js";

export const getClaims = async (req, res) => {
  try {
    // Only allow insurers to see all claims
    if (req.user.role !== 'insurer') {
      return res.status(403).json({ message: "Access denied. Insurer role required." });
    }
    
    const claims = await Claim.find().populate("userId", "name email role");
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserClaims = async (req, res) => {
  try {
    // Allow patients to only view their own claims
    // Allow insurers to view any user's claims
    const userId = req.params.userId;
    
    if (req.user.role !== 'insurer' && req.user.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied. You can only view your own claims." });
    }
    
    const claims = await Claim.find({ userId: userId })
      .sort({ createdAt: -1 }); // Newest first
    res.json(claims);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch user claims',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// claimController.js - updateClaim function
import mongoose from 'mongoose';

export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedAmount, comments } = req.body;
    
    console.log('Update claim request:', {
      claimId: id,
      body: req.body,
      user: req.user
    });
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid claim ID format' });
    }
    
    // Only insurers can update claims
    if (req.user.role !== 'insurer') {
      return res.status(403).json({ message: "Access denied. Insurer role required." });
    }
    
    // Validation
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find claim first
    const claim = await Claim.findById(id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Update the claim fields
    claim.status = status;
    claim.insurerComments = comments || '';
    
    if (status === 'Approved') {
      claim.approvedAmount = parseFloat(approvedAmount) || 0;
    }
    
    // Save the updated claim
    await claim.save();
    
    console.log('Claim updated successfully:', claim);
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({
      message: 'Failed to update claim',
      error: error.message
    });
  }
};

export const submitClaim = async (req, res) => {
  try {
    const { name, email, claimAmount, description } = req.body;
    
    // Only patients can submit claims
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: "Access denied. Only patients can submit claims." });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Document is required" });
    }

    const newClaim = await Claim.create({
      userId: req.user.userId, // Get from authenticated user
      name,
      email,
      claimAmount,
      description,
      documentUrl: `/uploads/${req.file.filename}`,
      status: "Pending"
    });

    res.status(201).json(newClaim);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};