const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Scene = require("../models/Scene");
const authMiddleware = require("../middleware/auth");
const checkAndUnlockAnimations = require("../middleware/unlockChecker");

/**
 * CREATE SCENE ROUTE
 * POST /api/scenes
 * Saves a new scene + checks for animation unlocks
 * Private (requires login)
 */
router.post(
  "/",
  authMiddleware,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Scene name is required")
      .isLength({ max: 100 })
      .withMessage("Scene name cannot exceed 100 characters"),

    body("config").isObject().withMessage("Config must be an object"),
    
    body("config.animationStyle")
      .optional()
      .isIn(["rotate", "float", "spiral", "chaos", "alien"])
      .withMessage("Invalid animation style"),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, description, config } = req.body;

      const scene = new Scene({
        name,
        description: description || "",
        userId: req.user._id,
        config,
      });

      await scene.save();
      
      // Check if this unlocks any animations
      await checkAndUnlockAnimations(req, res, async () => {
        await scene.populate("userId", "username");

        res.status(201).json({
          success: true,
          message: "Scene created successfully",
          scene,
          unlockedAnimations: req.unlockedAnimations || [],
        });
      });
    } catch (error) {
      console.error("Create scene error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating scene",
        error: error.message,
      });
    }
  }
);

/**
 * GET MY SCENES ROUTE
 * GET /api/scenes/my-scenes
 * Gets current user's scenes only
 * Private (requires login)
 */
router.get("/my-scenes", authMiddleware, async (req, res) => {
  try {
    const scenes = await Scene.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: scenes.length,
      scenes,
    });
  } catch (error) {
    console.error("Get my scenes error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your scenes",
    });
  }
});

/**
 * UPDATE SCENE ROUTE
 * PUT /api/scenes/:id
 * Updates an existing scene (merges config instead of replacing)
 * Private (must be scene owner)
 */
router.put(
  '/:id',
  authMiddleware,
  [ 
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Scene name cannot exceed 100 characters'),

    body('config')
      .optional()
      .isObject()
      .withMessage('Config must be an object'),
    
    body("config.animationStyle")
      .optional()
      .isIn(["rotate", "float", "spiral", "chaos", "alien"])
      .withMessage("Invalid animation style"),
      
    body("config.environmentHue")
      .optional()
      .isFloat({ min: 0, max: 360 })
      .withMessage("Environment hue must be between 0 and 360"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const scene = await Scene.findById(req.params.id);

      if (!scene) {
        return res.status(404).json({
          success: false,
          message: 'Scene not found'
        });
      }
      
      // Check ownership
      if (scene.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this scene'
        });
      }
      
      // Update fields if provided
      const { name, description, config } = req.body;
      
      if (name) scene.name = name;
      if (description !== undefined) scene.description = description;
      
      // IMPORTANT: Merge config instead of replacing wholesale
      if (config) {
        scene.config = {
          ...scene.config.toObject(), // Existing config
          ...config // New config (overwrites matching keys)
        };
      }

      await scene.save();

      res.json({
        success: true,
        message: 'Scene updated successfully',
        scene
      });

    } catch (error) {
      console.error('Update scene error:', error);
      res.status(500).json({
        success: false, 
        message: 'Error updating scene'
      });
    }
  }
);

/**
 * DELETE SCENE ROUTE
 * DELETE /api/scenes/:id
 * Deletes a scene
 * Private (must be scene owner)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);

    if (!scene) {
      return res.status(404).json({
        success: false,
        message: 'Scene not found'
      });
    }

    // Check ownership
    if (scene.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this scene'
      });
    }

    await Scene.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Scene deleted successfully'
    });

  } catch (error) {
    console.error('Delete scene error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scene'
    });
  }
});

module.exports = router;

// REMOVED ROUTES (no longer needed):
// - GET /api/scenes (public gallery)
// - GET /api/scenes/:id (view single public scene)
//
// FINAL ROUTES (4 total):
// ✅ POST   /api/scenes           - Create your scene
// ✅ GET    /api/scenes/my-scenes - Get your scenes
// ✅ PUT    /api/scenes/:id       - Update your scene
// ✅ DELETE /api/scenes/:id       - Delete your scene