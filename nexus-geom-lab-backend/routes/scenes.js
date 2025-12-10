/**
 * Scene Routes
 * Handles scene CRUD operations and unlock progression system.
 */

const express = require('express'); // Web framework for Node.js
const router = express.Router(); // Create router instance for scene routes
const { body, validationResult } = require('express-validator'); // Input validation tools
const Scene = require('../models/Scene'); // Scene database model
const User = require('../models/User'); // User database model
const authMiddleware = require('../middleware/auth'); // JWT authentication middleware

// Unlock progression rules - defines what unlocks at each scene count milestone
const UNLOCK_PROGRESSION = [
  { sceneCount: 1, noetechKey: 'icarus-x', type: 'noetech' }, // 1st save → unlock Icarus-X character
  { sceneCount: 2, noetechKey: 'vectra', type: 'noetech' }, // 2nd save → unlock Vectra character
  { sceneCount: 3, noetechKey: 'nexus', type: 'noetech' }, // 3rd save → unlock Nexus character
  { sceneCount: 4, noetechKey: 'she-tech', type: 'noetech' }, // 4th save → unlock She-Tech character
  {
    sceneCount: 5,
    noetechKey: 'icarus-x',
    animationId: 'phoenix-dive',
    type: 'animation', // 5th save → unlock Phoenix Dive animation for Icarus-X
  },
];

// Check unlock progression and update user document
const checkAndUnlockAnimations = async (user) => {
  const newlyUnlocked = []; // Track what unlocks during this save

  for (const unlock of UNLOCK_PROGRESSION) {
    // Loop through each unlock rule
    if (user.scenesSaved === unlock.sceneCount) {
      // Does user's scene count match this rule's requirement?
      if (unlock.type === 'noetech') {
        // This unlock is a character
        const alreadyUnlocked = user.unlockedNoetechs.includes(unlock.noetechKey); // Check if already have this character
        if (!alreadyUnlocked) {
          // If not already unlocked
          user.unlockedNoetechs.push(unlock.noetechKey); // Add character to user's unlocked list
          newlyUnlocked.push(unlock); // Track for response
        }
      } else if (unlock.type === 'animation') {
        // This unlock is an animation
        const alreadyUnlocked = user.unlockedAnimations.some(
          (ua) => ua.noetechKey === unlock.noetechKey && ua.animationId === unlock.animationId
        ); // Check if already have this specific animation

        if (!alreadyUnlocked) {
          // If not already unlocked
          user.unlockedAnimations.push({
            noetechKey: unlock.noetechKey,
            animationId: unlock.animationId,
          }); // Add animation to user's unlocked list
          newlyUnlocked.push(unlock); // Track for response
        }
      }
    }
  }

  return newlyUnlocked; // Return array of what was just unlocked
};

// Create new scene
router.post(
  '/', // POST /api/scenes endpoint
  authMiddleware, // Verify user is logged in
  [
    body('name') // Validate scene name field
      .trim() // Remove whitespace
      .notEmpty() // Must not be empty
      .withMessage('Scene name is required')
      .isLength({ max: 100 }) // Max 100 characters
      .withMessage('Scene name cannot exceed 100 characters'),
    body('config').isObject().withMessage('Config must be an object'), // Config must be object
  ],
  async (req, res) => {
    // Route handler function
    try {
      // Validate input
      const errors = validationResult(req); // Check if validation passed
      if (!errors.isEmpty()) {
        // If validation failed
        return res.status(400).json({
          // Send 400 Bad Request
          success: false,
          errors: errors.array(), // Send validation errors
        });
      }

      const { name, description, config } = req.body; // Extract scene data from request

      // Create and save scene
      const scene = new Scene({
        // Create new scene document
        name, // Scene name
        description: description || '', // Description or empty string
        userId: req.user._id, // Link to user who created it
        config, // All control values from frontend
      });

      const savedScene = await scene.save(); // Save scene to MongoDB

      // Update user scene count and check unlocks
      const user = await User.findById(req.user._id); // Fetch fresh user document
      user.scenesSaved += 1; // Increment scene counter
      const newUnlocks = await checkAndUnlockAnimations(user); // Check if this save unlocks anything
      await user.save(); // Save updated user to MongoDB

      // Populate user info for response
      await savedScene.populate('userId', 'username'); // Replace userId with username for response

      // Separate unlocks by type
      const noetechUnlocks = newUnlocks.filter((u) => u.type === 'noetech'); // Filter for character unlocks
      const animationUnlocks = newUnlocks.filter((u) => u.type === 'animation'); // Filter for animation unlocks

      // Build response
      const response = {
        success: true,
        message: 'Scene created successfully',
        scene: savedScene, // Full scene document
        totalScenes: user.scenesSaved, // Total scenes user has saved
      };

      // Add unlocks if any
      if (noetechUnlocks.length > 0) {
        // If any characters unlocked
        response.unlockedNoetechs = noetechUnlocks.map((u) => u.noetechKey); // Extract character keys
      }

      if (animationUnlocks.length > 0) {
        response.unlockedAnimations = animationUnlocks.map((unlock) => ({
          noetechKey: unlock.noetechKey,
          animationId: unlock.animationId,
          noetechName: unlock.noetechKey.charAt(0).toUpperCase() + unlock.noetechKey.slice(1),
          animationName: unlock.animationId
            ? unlock.animationId.charAt(0).toUpperCase() + unlock.animationId.slice(1)
            : '',
        }));
      }

      res.status(201).json(response); // Send 201 Created with response data
    } catch (error) {
      // If anything goes wrong
      res.status(500).json({
        // Send 500 Server Error
        success: false,
        message: 'Error creating scene',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Get current user's scenes
router.get('/my-scenes', authMiddleware, async (req, res) => {
  // GET /api/scenes/my-scenes
  try {
    const scenes = await Scene.find({ userId: req.user._id }).sort({
      // Find all scenes by this user
      createdAt: -1, // Sort newest first
    });

    res.json({
      // Send response
      success: true,
      count: scenes.length, // Total number of scenes
      scenes, // Array of scene documents
    });
  } catch (error) {
    // If query fails
    res.status(500).json({
      // Send 500 Server Error
      success: false,
      message: 'Error fetching your scenes',
    });
  }
});

// Update existing scene
router.put(
  '/:id', // PUT /api/scenes/:id endpoint
  authMiddleware, // Verify user is logged in
  [
    body('name') // Validate name if provided
      .optional() // Field is optional for updates
      .trim() // Remove whitespace
      .isLength({ max: 100 }) // Max 100 characters
      .withMessage('Scene name cannot exceed 100 characters'),
    body('config') // Validate config if provided
      .optional() // Field is optional for updates
      .isObject() // Must be object
      .withMessage('Config must be an object'),
    body('config.environmentHue') // Validate hue if provided
      .optional() // Field is optional for updates
      .isFloat({ min: 0, max: 360 }) // Must be 0-360
      .withMessage('Environment hue must be between 0 and 360'),
  ],
  async (req, res) => {
    // Route handler function
    try {
      // Validate input
      const errors = validationResult(req); // Check if validation passed
      if (!errors.isEmpty()) {
        // If validation failed
        return res.status(400).json({
          // Send 400 Bad Request
          success: false,
          errors: errors.array(), // Send validation errors
        });
      }

      // Find scene
      const scene = await Scene.findById(req.params.id); // Look up scene by ID from URL

      if (!scene) {
        // If scene doesn't exist
        return res.status(404).json({
          // Send 404 Not Found
          success: false,
          message: 'Scene not found',
        });
      }

      // Check ownership
      if (scene.userId.toString() !== req.user._id.toString()) {
        // If user doesn't own this scene
        return res.status(403).json({
          // Send 403 Forbidden
          success: false,
          message: 'Not authorized to update this scene',
        });
      }

      // Update fields
      const { name, description, config } = req.body; // Extract update data

      if (name) scene.name = name; // Update name if provided
      if (description !== undefined) scene.description = description; // Update description if provided

      // Merge config instead of replacing
      if (config) {
        // If config provided
        scene.config = {
          ...scene.config.toObject(), // Spread existing config
          ...config, // Spread new config (overwrites matching keys)
        };
      }

      await scene.save(); // Save updated scene to MongoDB

      res.json({
        // Send response
        success: true,
        message: 'Scene updated successfully',
        scene, // Updated scene document
      });
    } catch (error) {
      // If anything goes wrong
      res.status(500).json({
        // Send 500 Server Error
        success: false,
        message: 'Error updating scene',
      });
    }
  }
);

// Delete scene
router.delete('/:id', authMiddleware, async (req, res) => {
  // DELETE /api/scenes/:id endpoint
  try {
    // Find scene
    const scene = await Scene.findById(req.params.id); // Look up scene by ID from URL

    if (!scene) {
      // If scene doesn't exist
      return res.status(404).json({
        // Send 404 Not Found
        success: false,
        message: 'Scene not found',
      });
    }

    // Check ownership
    if (scene.userId.toString() !== req.user._id.toString()) {
      // If user doesn't own this scene
      return res.status(403).json({
        // Send 403 Forbidden
        success: false,
        message: 'Not authorized to delete this scene',
      });
    }

    await Scene.findByIdAndDelete(req.params.id); // Delete scene from MongoDB

    res.json({
      // Send response
      success: true,
      message: 'Scene deleted successfully',
    });
  } catch (error) {
    // If anything goes wrong
    res.status(500).json({
      // Send 500 Server Error
      success: false,
      message: 'Error deleting scene',
    });
  }
});

module.exports = router; // Export router to be mounted in server
