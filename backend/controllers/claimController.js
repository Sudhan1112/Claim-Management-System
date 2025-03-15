// controllers/claimController.js
import Claim from "../models/claimModel.js";

export const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate("userId", "name email role");
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user.userId });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateClaim = async (req, res) => {
  try {
    const { status, approvedAmount, comments } = req.body;
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, approvedAmount, insurerComments: comments },
      { new: true }
    );
    res.json({ message: "Claim updated", claim });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const submitClaim = async (req, res) => {
  try {
    const { name, email, claimAmount, description } = req.body;
    
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