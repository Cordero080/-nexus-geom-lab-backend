const mongoose = require("mongoose");

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ALL PLAYGROUND SETTINGS
  config: {
    // Material Properties
    scale: { type: Number, default: 1, min: 0.1, max: 5 },
    metalness: { type: Number, default: 0.5, min: 0, max: 1 },
    emissiveIntensity: { type: Number, default: 0, min: 0, max: 5 },
    baseColor: { type: String, default: "#ff00ff" },
    wireframeIntensity: { type: Number, default: 50, min: 0, max: 100 },

    // Hyperframe
    hyperframeColor: { type: String, default: "#ff4500" },
    hyperframeLineColor: { type: String, default: "#00ff00" },

    // Mega overlay controls removed (not used currently)

    // Scene Behavior
    cameraView: { type: String, default: "free" },
    environment: { type: String, default: "nebula" },
    environmentHue: { type: Number, default: 0, min: 0, max: 360 },
    objectCount: { type: Number, default: 1, min: 1, max: 24 },
    animationStyle: {
      type: String,
      default: "rotate",
      // No validation - all visual effects are always available
    },
    objectType: { type: String, default: "icosahedron" },
    objectSpeed: { type: Number, default: 1.0, min: 0.1, max: 5 },
    orbSpeed: { type: Number, default: 1.0, min: 0.1, max: 5 },

    // Lighting
    ambientLightColor: { type: String, default: "#ffffff" },
    ambientLightIntensity: { type: Number, default: 0.5 },
    directionalLightColor: { type: String, default: "#ffffff" },
    directionalLightIntensity: { type: Number, default: 1.0 },
    directionalLightX: { type: Number, default: 10 },
    directionalLightY: { type: Number, default: 10 },
    directionalLightZ: { type: Number, default: 5 },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp before saving
sceneSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Helpful index for frequent queries
sceneSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Scene", sceneSchema);

// REMOVED FIELDS (no longer needed):
// - isPublic (no public gallery)
// - views (no view counting)
// - likes (no social features)
