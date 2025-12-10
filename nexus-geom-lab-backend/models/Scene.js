const mongoose = require("mongoose"); // MongoDB ODM library

// Scene schema - blueprint for scene documents
const sceneSchema = new mongoose.Schema({
  name: {
    // Scene name field
    type: String, // Data type
    required: true, // Cannot be empty
    trim: true, // Remove whitespace
    maxlength: 100, // Max 100 characters
  },
  description: {
    // Scene description field
    type: String, // Data type
    trim: true, // Remove whitespace
    maxlength: 500, // Max 500 characters
    default: "", // Empty string if not provided
  },
  userId: {
    // User who created this scene
    type: mongoose.Schema.Types.ObjectId, // Reference to User document
    ref: "User", // Links to User model
    required: true, // Must have owner
  },

  // All playground settings
  config: {
    // Material Properties
    scale: { type: Number, default: 1, min: 0.1, max: 5 }, // Object size
    metalness: { type: Number, default: 0.5, min: 0, max: 1 }, // Metal appearance
    emissiveIntensity: { type: Number, default: 0, min: 0, max: 5 }, // Glow intensity
    baseColor: { type: String, default: "#ff00ff" }, // Object color
    wireframeIntensity: { type: Number, default: 50, min: 0, max: 100 }, // Wireframe visibility

    // Hyperframe
    hyperframeColor: { type: String, default: "#ff4500" }, // Hyperframe fill color
    hyperframeLineColor: { type: String, default: "#00ff00" }, // Hyperframe line color

    // Scene Behavior
    cameraView: { type: String, default: "free" }, // Camera mode
    environment: { type: String, default: "nebula" }, // Background environment
    environmentHue: { type: Number, default: 0, min: 0, max: 360 }, // Environment color shift
    objectCount: { type: Number, default: 1, min: 1, max: 24 }, // Number of objects
    animationStyle: {
      // Animation type
      type: String,
      default: "rotate", // Default animation
    },
    objectType: { type: String, default: "icosahedron" }, // Geometry type
    objectSpeed: { type: Number, default: 1.0, min: 0.1, max: 5 }, // Rotation speed
    orbSpeed: { type: Number, default: 1.0, min: 0.1, max: 5 }, // Orbit speed

    // Lighting
    ambientLightColor: { type: String, default: "#ffffff" }, // Ambient light color
    ambientLightIntensity: { type: Number, default: 0.5 }, // Ambient light strength
    directionalLightColor: { type: String, default: "#ffffff" }, // Directional light color
    directionalLightIntensity: { type: Number, default: 1.0 }, // Directional light strength
    directionalLightX: { type: Number, default: 10 }, // Light X position
    directionalLightY: { type: Number, default: 10 }, // Light Y position
    directionalLightZ: { type: Number, default: 5 }, // Light Z position
  },

  createdAt: {
    // When scene was created
    type: Date, // Data type
    default: Date.now, // Current time when created
  },
  updatedAt: {
    // When scene was last modified
    type: Date, // Data type
    default: Date.now, // Current time when created
  },
});

// Pre-save hook - update timestamp before saving
sceneSchema.pre("save", function (next) {
  // Runs before save() operation
  this.updatedAt = Date.now(); // Update timestamp to current time
  next(); // Continue to save
});

// Database index for faster queries
sceneSchema.index({ userId: 1, createdAt: -1 }); // Index on userId (ascending) and createdAt (descending)
// Makes queries like "find all scenes by this user, newest first" much faster

module.exports = mongoose.model("Scene", sceneSchema); // Export Scene model for use in routes
