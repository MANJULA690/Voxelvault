const express = require("express");
const User = require("../models/User");
const Model3D = require("../models/Model3D");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/:id/profile
router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const uploads = await Model3D.find({ author: user._id }).sort({ createdAt: -1 });
    res.json({ user, uploads });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/profile — update own profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/bookmark/:modelId — toggle bookmark
router.put("/bookmark/:modelId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const modelId = req.params.modelId;

    const idx = user.bookmarks.findIndex((b) => b.toString() === modelId);
    if (idx > -1) {
      user.bookmarks.splice(idx, 1);
    } else {
      user.bookmarks.push(modelId);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/bookmarks — get my bookmarked models
router.get("/bookmarks/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      populate: { path: "author", select: "name avatar" },
    });
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
