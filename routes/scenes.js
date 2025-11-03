const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Scene = require("../models/Scene");
const User = require("../models/User"); // Add User import
const authMiddleware = require("../middleware/auth");
const UNLOCK_PROGRESSION = [
  // Scene 1: Unlock first Noetech (icarus-x) - character appears in showcase
  { sceneCount: 1, noetechKey: "icarus-x", type: "noetech" },
  // Scene 2: Unlock second Noetech (vectra) - second character appears
  { sceneCount: 2, noetechKey: "vectra", type: "noetech" },
  // Scene 3: Unlock third Noetech (nexus) - third character appears
  { sceneCount: 3, noetechKey: "nexus", type: "noetech" },
  // Scene 4: Unlock second animation for icarus-x - animation switcher appears
  {
    sceneCount: 4,
    noetechKey: "icarus-x",
    animationId: "phoenix-dive",
    type: "animation",
  },
];

const checkAndUnlockAnimations = async (user) => {
  console.log(
    `🔍 Debug: Checking unlocks for user with ${user.scenesSaved} scenes`
  );
  console.log(`🔍 Debug: Current unlocked Noetechs:`, user.unlockedNoetechs);
  console.log(
    `🔍 Debug: Current unlocked animations:`,
    user.unlockedAnimations
  );

  const newlyUnlocked = [];

  for (const unlock of UNLOCK_PROGRESSION) {
    console.log(
      `🔍 Debug: Checking unlock - Scene ${unlock.sceneCount}: ${unlock.noetechKey} (${unlock.type})`
    );

    // Only unlock on EXACT scene count match
    if (user.scenesSaved === unlock.sceneCount) {
      console.log(
        `✅ Debug: Scene count matches! Checking type: ${unlock.type}`
      );

      if (unlock.type === "noetech") {
        // Unlock Noetech (character appears in showcase)
        const alreadyUnlocked = user.unlockedNoetechs.includes(
          unlock.noetechKey
        );

        if (!alreadyUnlocked) {
          console.log(`🎉 Debug: UNLOCKING NOETECH ${unlock.noetechKey}!`);
          user.unlockedNoetechs.push(unlock.noetechKey);
          newlyUnlocked.push(unlock);
        } else {
          console.log(
            `⚠️ Debug: Noetech ${unlock.noetechKey} already unlocked`
          );
        }
      } else if (unlock.type === "animation") {
        // Unlock additional animation for existing Noetech
        const alreadyUnlocked = user.unlockedAnimations.some(
          (ua) =>
            ua.noetechKey === unlock.noetechKey &&
            ua.animationId === unlock.animationId
        );

        if (!alreadyUnlocked) {
          console.log(
            `🎉 Debug: UNLOCKING ANIMATION ${unlock.noetechKey}:${unlock.animationId}!`
          );
          user.unlockedAnimations.push({
            noetechKey: unlock.noetechKey,
            animationId: unlock.animationId,
          });
          newlyUnlocked.push(unlock);
        } else {
          console.log(
            `⚠️ Debug: Animation ${unlock.noetechKey}:${unlock.animationId} already unlocked`
          );
        }
      }
    } else {
      console.log(
        `❌ Debug: Scene count doesn't match (${user.scenesSaved} !== ${unlock.sceneCount})`
      );
    }
  }

  console.log(
    `🎯 Debug: Returning ${newlyUnlocked.length} newly unlocked items`
  );
  return newlyUnlocked;
};
/**
 * CREATE SCENE ROUTE
 * POST /api/scenes
 * Saves a new scene + checks for Noetech unlocks
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

    // No animationStyle validation - all visual effects are always available
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

      const savedScene = await scene.save();

      // Update user's scene count and check for animation unlocks
      const user = await User.findById(req.user._id);
      user.scenesSaved += 1;

      console.log(
        `🎯 Debug: User ${user.email} now has ${user.scenesSaved} scenes saved`
      );

      // Check for new animation/noetech unlocks
      const newUnlocks = await checkAndUnlockAnimations(user);

      console.log(
        `🎯 Debug: Found ${newUnlocks.length} new unlocks:`,
        newUnlocks
      );

      await user.save();

      // Populate the scene for response
      await savedScene.populate("userId", "username");

      // Separate unlocks by type
      const noetechUnlocks = newUnlocks.filter((u) => u.type === "noetech");
      const animationUnlocks = newUnlocks.filter((u) => u.type === "animation");

      const response = {
        success: true,
        message: "Scene created successfully",
        scene: savedScene,
        totalScenes: user.scenesSaved,
      };

      // Add unlocks to response if any exist
      if (noetechUnlocks.length > 0) {
        response.unlockedNoetechs = noetechUnlocks.map((u) => u.noetechKey);
      }

      if (animationUnlocks.length > 0) {
        response.unlockedAnimations = animationUnlocks.map((unlock) => ({
          noetechKey: unlock.noetechKey,
          animationId: unlock.animationId,
          noetechName:
            unlock.noetechKey.charAt(0).toUpperCase() +
            unlock.noetechKey.slice(1),
          animationName: unlock.animationId
            ? unlock.animationId.charAt(0).toUpperCase() +
              unlock.animationId.slice(1)
            : "",
        }));
      }

      res.status(201).json(response);
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
  "/:id",
  authMiddleware,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Scene name cannot exceed 100 characters"),

    body("config")
      .optional()
      .isObject()
      .withMessage("Config must be an object"),

    // No animationStyle validation - all visual effects are always available

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
          errors: errors.array(),
        });
      }

      const scene = await Scene.findById(req.params.id);

      if (!scene) {
        return res.status(404).json({
          success: false,
          message: "Scene not found",
        });
      }

      // Check ownership
      if (scene.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this scene",
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
          ...config, // New config (overwrites matching keys)
        };
      }

      await scene.save();

      // Scene updates should NOT trigger unlocks - only scene creation should
      const response = {
        success: true,
        message: "Scene updated successfully",
        scene,
      };

      res.json(response);
    } catch (error) {
      console.error("Update scene error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating scene",
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
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);

    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Scene not found",
      });
    }

    // Check ownership
    if (scene.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this scene",
      });
    }

    await Scene.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Scene deleted successfully",
    });
  } catch (error) {
    console.error("Delete scene error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting scene",
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
