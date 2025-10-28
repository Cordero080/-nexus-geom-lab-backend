const Scene = require("../models/Scene");

const checkAndUnlockNoetech = async (req, res, next) => {
  try {
    const user = req.user;

    // Increment scenes saved count and check for unlocks
    const newlyUnlocked = user.incrementScenesSaved();

    // Save user with updated count and any new unlocks
    await user.save();

    // Expose newly unlocked Noetechs to the response
    if (newlyUnlocked.length > 0) {
      req.unlockedNoetechs = newlyUnlocked;
    }

    next();
  } catch (error) {
    console.error("Noetech unlock check error:", error);
    next(); // Don't fail request if unlock check fails
  }
};

module.exports = checkAndUnlockNoetech;

// PROGRESSIVE UNLOCK FLOW:
// User saves 1st scene:
// → scenesSaved = 1 → Unlock "icarus-x"! 🎉
// → Send newlyUnlocked: ["icarus-x"] to frontend

// User saves 2nd scene:
// → scenesSaved = 2 → Unlock "vectra"! 🎉
// → Send newlyUnlocked: ["vectra"] to frontend

// User saves 3rd scene:
// → scenesSaved = 3 → Unlock "nexus"! 🎉
// → Send newlyUnlocked: ["nexus"] to frontend
