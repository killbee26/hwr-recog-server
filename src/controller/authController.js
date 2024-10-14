const User = require('../models/User');

// Login or register user (Google or GitHub OAuth)
exports.loginUser = async (req, res) => {
  const { name, email, provider } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        provider,
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
