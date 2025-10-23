const express = require("express");
const router = express.Router();
// Import validation functions
const { body, validationResult, check } = require("express-validator");
const Scene = require("../models/Scene");
const authMiddleware = require("../middleware/auth");
// Import unlock checker - checks if animations should unlock
const checkAndUnlockAnimations = require("../middleware/unlockChecker");

/**
 * CREATE SCENE ROUTE
 * POST /api/scenes
 * Saves a new scene + checks for unlocks!
 * Private (requires login)
 */
// router.post() = Handle POST requests
// '/' = Base path (full path will be /api/scenes)
// authMiddleware = Verify user is logged in FIRST

router.post(
  "/",
  authMiddleware, //MUST BE LOGGED IN
  [
    //Validate scene name
    body("name")
      .trim()
      .notEmpty() // Can't be empty
      .withMessage("Scene name is required") // Error message if validation fails
      .isLength({ max: 100 }) // Max 100 characters
      .withMessage("Scene name cannot exceed 100 characters"),

    // Validate config exists and is an object
    body("config").isObject().withMessage("Config must be an object"),
    
    // Validate animation style (removed: liquid, metal, dna)
    body("config.animationStyle")
      .optional()
      .isIn(["rotate", "float", "spiral", "chaos", "alien", "magnetic"])
      .withMessage("Invalid animation style"),
  ],

  async (req, res) => {
    try {
      // Get validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      // Extract data from request body
      // Destructuring - pulls these properties out
      const { name, description, config, isPublic } = req.body;

      //Create new scene object
      const scene = new Scene({
        name,
        description: description || "", //If no description, use empty string
        userId: req.user._id, // req.user set by authMiddleware
        config, // All playground settings including new environmentHue!

        // Ternary operator: if isPublic is defined, use it, otherwise default to true
        isPublic: isPublic !== undefined ? isPublic : true,
      });

      await scene.save();
      // NOW THE MAGIC: Check if this unlocks any animations! 🎮
      // checkAndUnlockAnimations = Custom middleware
      // Takes (req, res, next) where next is a callback function
      await checkAndUnlockAnimations(req, res, async () => {
        // .populate() = Replace userId with actual user data
        // 'userId' = Field to populate
        // 'username' = Only get the username field
        await scene.populate("userId", "username");

        // send response

        res.status(201).json({
          success: true,
          message: "Scene created successfully",
          scene,
          // req.unlockedAnimations was set by unlock checker if any unlocked
          // || [] = If undefined, use empty array
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
 * GET ALL SCENES ROUTE
 * GET /api/scenes
 * Gets public scenes (gallery) OR user's own scenes
 * Public (no login required for gallery)
 */

router.get("/", async (req, res) => {
  try {
    const { userId, isPublic } = req.query;
    let query = {};
    
    if (userId) {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (token) {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId === userId) {
          query.userId = userId;
        }
      }
    } else {
      query.isPublic = true;
    }
    
    const scenes = await Scene.find(query)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json({
      success: true,
      count: scenes.length,
      scenes,
    });
  } catch (error) {
    console.error("Get scenes error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching scenes",
    });
  }
});

/**
 * GET MY SCENES ROUTE
 * GET /api/scenes/my-scenes
 * Gets current user's scenes
 * Private (requires login)
 */

// authMiddleware = Must be logged in

router.get("/my-scenes", authMiddleware, async (req, res) => {
  try {
    // Find all scenes where userId matches current user
    const scenes = await Scene.find({ userId: req.user._id }).sort({
      createdAt: -1,
    }); // NEWEST FIRST

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
 * GET SINGLE SCENE ROUTE
 * GET /api/scenes/:id
 * Gets one specific scene by ID
 * Public (if scene is public) or Private (if user's scene)
 */
// :id = Route parameter (dynamic value in URL)
// Example: /api/scenes/abc123 → req.params.id = "abc123"

router.get("/:id", async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id).populate(
      "userId",
      "username"
    );

    // If scene doesn't exist
    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Scene not found",
      });
    }
    
    // Check if user is the owner
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // let = Can be reassigned
    let isOwner = false;

    if (token) {
      const jwt = require("jsonwebtoken");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // .toString()
        isOwner = decoded.userId === scene.userId._id.toString();
      } catch (err) {
        // Invalid token, treat as public request
      }
    }

    // If scene is private AND user is not owner
    // && = AND operator (both conditions must be true)
    if (!scene.isPublic && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied - scene is private",
      });
    }

    // Increment view count
    // += = Add to existing value (scene.views = scene.views + 1)
    scene.views += 1;
    await scene.save();

    res.json({
      success: true,
      scene,
    });
  } catch (error) {
    console.error("Get scene error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching scene",
    });
  }
});

/**
 * UPDATE SCENE ROUTE
 * PUT /api/scenes/:id
 * Updates an existing scene
 * Private (must be scene owner)
 */

// router.put() = Handle PUT requests (for updates)
router.put(
  '/:id',
  authMiddleware,
  [ 
    // .optional() = Field doesn't have to be present
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Scene name cannot exceed 100 characters'),

    body('config')
      .optional()
      .isObject()
      .withMessage('Config must be an object'),
    
    // Validate animation style if provided (removed: liquid, metal, dna)
    body("config.animationStyle")
      .optional()
      .isIn(["rotate", "float", "spiral", "chaos", "alien", "magnetic"])
      .withMessage("Invalid animation style"),
      
    // Validate environmentHue if provided (0-360 degrees)
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
      
      // Find scene by ID
      const scene = await Scene.findById(req.params.id);

      if (!scene) {
        return res.status(404).json({
          success: false,
          message: 'Scene not found'
        });
      }
      
      // Check if current user owns this scene
      // !== = Not equal (strict inequality)
      if (scene.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this scene'
        });
      }
      
      // Update fields if provided
      const {name, description, config, isPublic} = req.body;
      
      // if (name) = If name exists (truthy value)
      if (name) scene.name = name;

      // !== undefined = If description was sent (even if empty string)
      if (description !== undefined) scene.description = description;
      if (config) scene.config = config;
      if (isPublic !== undefined) scene.isPublic = isPublic;

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
// TODO: Implement delete route


module.exports = router;