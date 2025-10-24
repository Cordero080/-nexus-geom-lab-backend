const Scene = require("../models/Scene");

const checkAndUnlockAnimations = async (req, res, next) => {
  try {
    const user = req.user;

    // Count user's total scenes
    const sceneCount = await Scene.countDocuments({ userId: user._id });

    // UNLOCK rules - thresholds based on scene count
    const unlockRules = [
      { sceneCount: 1, animationName: "float" }, // After 1st scene
      { sceneCount: 3, animationName: "spiral" }, // After 3rd scene
      { sceneCount: 5, animationName: "chaos" }, // After 5th scene
      { sceneCount: 10, animationName: "alien" }, // After 10th scene
    ];

    let newlyUnlocked = [];

    for (const rule of unlockRules) {
      if (
        sceneCount >= rule.sceneCount &&
        !user.hasUnlockedAnimation(rule.animationName)
      ) {
        user.unlockAnimation(rule.animationName);
        newlyUnlocked.push(rule.animationName);
      }
    }

    // Save if new unlocks
    if (newlyUnlocked.length > 0) {
      await user.save();
      req.unlockedAnimations = newlyUnlocked;
    }

    next();
  } catch (error) {
    console.error("Unlock check error:", error);
    next(); // Don't fail request if unlock check fails
  }
};

module.exports = checkAndUnlockAnimations;

// EXAMPLE FLOW:
// User saves 1st scene:
// → Count scenes = 1
// → Check rules: sceneCount >= 1 → Unlock "float"! 🎉
// → Send newlyUnlocked: ["float"] to frontend
// → Frontend shows "Float Animation Unlocked!" notification

// User saves 3rd scene:
// → Count scenes = 3
// → Check rules: sceneCount >= 3 → Unlock "spiral"! 🎉
// → Send newlyUnlocked: ["spiral"] to frontend

// User saves 5th scene:
// → Count scenes = 5
// → Check rules: sceneCount >= 5 → Unlock "chaos"! 🎉

// User saves 10th scene:
// → Count scenes = 10
// → Check rules: sceneCount >= 10 → Unlock "alien"! 🎉
