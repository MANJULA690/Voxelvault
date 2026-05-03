const express = require("express");
const Model3D = require("../models/Model3D");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/models — get all models (with filters)
router.get("/", async (req, res) => {
  try {
    const { category, search, sort = "newest" } = req.query;
    let query = {};

    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption =
      sort === "popular" ? { likes: -1 } : sort === "views" ? { views: -1 } : { createdAt: -1 };

    const models = await Model3D.find(query)
      .sort(sortOption)
      .populate("author", "name avatar");

    res.json(models);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/models/featured
router.get("/featured", async (req, res) => {
  try {
    const models = await Model3D.find({ isFeatured: true })
      .limit(6)
      .populate("author", "name avatar");
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/models/:id
router.get("/:id", async (req, res) => {
  try {
    const model = await Model3D.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name avatar bio");

    if (!model) return res.status(404).json({ message: "Model not found" });
    res.json(model);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/models — create model (auth required)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, thumbnail, embedUrl, tags, category } = req.body;
    if (!title || !thumbnail) return res.status(400).json({ message: "Title and thumbnail required" });

    const model = await Model3D.create({
      title, description, thumbnail, embedUrl,
      tags: tags || [],
      category: category || "other",
      author: req.user._id,
    });

    await model.populate("author", "name avatar");
    res.status(201).json(model);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/models/:id/like — toggle like
router.put("/:id/like", protect, async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) return res.status(404).json({ message: "Not found" });

    const liked = model.likes.includes(req.user._id);
    if (liked) {
      model.likes = model.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      model.likes.push(req.user._id);
    }
    await model.save();
    res.json({ likes: model.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/models/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) return res.status(404).json({ message: "Not found" });
    if (model.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await model.deleteOne();
    res.json({ message: "Model deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
