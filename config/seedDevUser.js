// Auto-seed dev user on server start (development only)
const User = require('../models/User');

const seedDevUser = async () => {
  // Only run in development
  if (process.env.NODE_ENV === 'production') return;

  try {
    const email = process.env.DEV_USER_EMAIL || 'pablo@test.com';
    const password = process.env.DEV_USER_PASSWORD || 'test123';
    const username = process.env.DEV_USER_USERNAME || 'pablo';

    // Check if dev user already exists by email OR username
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      // Create new dev user
      user = new User({
        username,
        email,
        password,
        scenesSaved: 0,
        unlockedAnimations: [],
        unlockedNoetechs: [],
      });
      await user.save();
      console.log(`✨ Dev user created: ${email}`);
    } else {
      // Update existing user's password and email
      user.password = password;
      user.email = email;
      await user.save();
      console.log(`👤 Dev user updated: ${email}`);
    }
  } catch (error) {
    console.error('⚠️ Dev user seed error:', error.message);
  }
};

module.exports = seedDevUser;
