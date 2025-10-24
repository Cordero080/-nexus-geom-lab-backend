const Scene = require("../models/Scene");

const checkAndUnlockTechnosentients = async (req, res, next) => {
  try {
    const user = req.user;

    // Count user's total scenes
    const sceneCount = await Scene.countDocuments({ userId: user._id });

    // UNLOCK rules - thresholds based on scene count
    const unlockRules = [
      { sceneCount: 1, technosentient: "prismia" },      // After 1st scene
      { sceneCount: 2, technosentient: "magna-tek" },    // After 2nd scene
      { sceneCount: 3, technosentient: "nexus-prime" },  // After 3rd scene
      { sceneCount: 5, technosentient: "void-walker" }   // After 5th scene
    ];

    let newlyUnlocked = [];

    for (const rule of unlockRules) {
      if (
        sceneCount >= rule.sceneCount &&
        !user.hasUnlockedTechnosentient(rule.technosentient)
      ) {
        user.unlockTechnosentient(rule.technosentient);
        newlyUnlocked.push(rule.technosentient);
      }
    }

    // Save if new unlocks
    if (newlyUnlocked.length > 0) {
      await user.save();
      req.unlockedTechnosentients = newlyUnlocked;
    }

    next();
  } catch (error) {
    console.error("Technosentient unlock check error:", error);
    next(); // Don't fail request if unlock check fails
  }
};

module.exports = checkAndUnlockTechnosentients;

// EXAMPLE FLOW:
// User saves 1st scene:
// → Count scenes = 1
// → Check rules: sceneCount >= 1 → Unlock "prismia"! 🎉
// → Send newlyUnlocked: ["prismia"] to frontend
// → Frontend shows "Prismia Unlocked!" notification and updates showcase

// User saves 2nd scene:
// → Count scenes = 2
// → Check rules: sceneCount >= 2 → Unlock "magna-tek"! 🎉
// → Send newlyUnlocked: ["magna-tek"] to frontend

// User saves 3rd scene:
// → Count scenes = 3
// → Check rules: sceneCount >= 3 → Unlock "nexus-prime"! 🎉

// User saves 5th scene:
// → Count scenes = 5
// → Check rules: sceneCount >= 5 → Unlock "void-walker"! 🎉
