require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function testLogin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('./models/User');

  const user = await User.findOne({ email: 'dev@test.com' });

  if (!user) {
    console.log('NO USER FOUND');
    return mongoose.disconnect();
  }

  console.log('User:', user.email);
  console.log('Hashed password exists:', !!user.password);

  // Test password
  const isMatch = await bcrypt.compare('dev123', user.password);
  console.log('Password dev123 matches:', isMatch);

  if (!isMatch) {
    // Force reset password
    console.log('\nResetting password...');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('dev123', salt);
    await user.save();
    console.log('Password reset to dev123');
  }

  await mongoose.disconnect();
}

testLogin();
