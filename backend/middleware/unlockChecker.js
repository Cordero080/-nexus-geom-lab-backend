const Scene = require('../models/Scene');

const checkAndUnlockAnimations = async (req, res, next) => {
  try {
    const user= req.user;

    // Count user's total scenes
    const sceneCount = await Scene.countDocuments({ userId: user._id});

    // UNLOCK rules
    const unlockRules = [
      { sceneCount: 0, animationId: 1 },   // Welcome gift (already unlocked)
      { sceneCount: 1, animationId: 2 },
      { sceneCount: 3, animationId: 3 }      // After 1st scene
    ];

    let newlyUnlocked = [];

    for (const rule of unlockRules) {
      if(sceneCount >= rule.sceneCount && !user.hasUnlockedAnimation(rule.animationId)) {
        user.unlockAnimation(rule.animationId);
        newlyUnlocked.push(rule.animationId);
      }
    }

    // Save if new unlocks

    if(newlyUnlocked.length > 0) {
      await user.save();
      req.unlockedAnimations = newlyUnlocked;
    
    }
    next();
  } catch(error) {
    console.error('Unlock check error:', error);
    next();// Don't fail request if unlock check fails
  }
}

module.exports = checkAndUnlockAnimations;

// User saves 1st scene:
// → Count scenes = 1
// → Check rules: sceneCount >= 1 → Unlock animation #2! 🎉
// → Send newlyUnlocked: [2] to frontend
// → Frontend shows "Animation #2 Unlocked!" notification

// User saves 3rd scene:
// → Count scenes = 3
// → Check rules: sceneCount >= 3 → Unlock animation #3! 🎉