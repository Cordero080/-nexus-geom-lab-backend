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
    scale: { type: Number, default: 1 },
    metalness: { type: Number, default: 0.5 },
    emissiveIntensity: { type: Number, default: 0 },
    baseColor: { type: String, default: "#ff00ff" },
    wireframeIntensity: { type: Number, default: 50 },

    // Hyperframe
    hyperframeColor: { type: String, default: "#ff4500" },
    hyperframeLineColor: { type: String, default: "#00ff00" },

    // Scene Behavior
    cameraView: { type: String, default: "free" },
    environment: { type: String, default: "nebula" },
    environmentHue: { type: Number, default: 0 },
    objectCount: { type: Number, default: 1 },
    animationStyle: { 
      type: String, 
      default: "rotate",
      enum: ["rotate", "float", "spiral", "chaos", "alien"] // Removed "magnetic"
    },
    objectType: { type: String, default: "icosahedron" },

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

module.exports = mongoose.model("Scene", sceneSchema);

// REMOVED FIELDS (no longer needed):
// - isPublic (no public gallery)
// - views (no view counting)
// - likes (no social features)