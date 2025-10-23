const mongoose = require("mongoose");

const sceneSchema = new mongoose.Schema({
  // Simple field
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
  isPublic: {
    type: Boolean,
    default: true,
  },
 // NESTED OBJECT / SUBDOCUMENT
  // ALL PLAYGROUND SETTINGS HERE
  config: {
    // Material Properties   // Fields inside the nested object
    scale: { type: Number, default: 1 },
    shininess: { type: Number, default: 100 },
    specularColor: { type: String, default: "#00ffff" },
    specularIntensity: { type: Number, default: 1.0 },
    baseColor: { type: String, default: "#ff00ff" },
    wireframeIntensity: { type: Number, default: 50 },

    // Intricate Wireframe
    intricateWireframeSpiralColor: { type: String, default: "#ff4500" },
    intricateWireframeEdgeColor: { type: String, default: "#00ff00" },

    // Scene Behavior
    cameraView: { type: String, default: "free" },
    environment: { type: String, default: "nebula" },
    objectCount: { type: Number, default: 1 },
    animationStyle: { type: String, default: "rotate" },
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

  // Stats
  views: { type: Number, default: 0 },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },

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

//EXAMPLE save (CREATE of CRUD)

// When a user clicks "Save Scene", this is what gets stored:
// {
//   name: "Purple Dream Sphere",
//   userId: "user123",
//   config: {
//     scale: 1,
//     objectType: "icosahedron",
//     baseColor: "#ff00ff",
//     // ... all other settings
//   }
// }
