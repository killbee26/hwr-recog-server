const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use an environment variable for production

// Register a new user
exports.RegisterUser = async (req, res) => {
  const { name, email, password, image } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create new user
      user = new User({
        name,
        email,
        password: hashedPassword, // Store the hashed password
        image,
      });
      console.log("Creating new user",user);
      await user.save();

      return res.status(201).json(user); // Return user data after creation
    } else {
      return res.status(403).json({ error: 'User already exists with this email' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

// Login user and return JWT token
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Return the token along with user details (optional)
    return res.status(200).json({ token, user: { name: user.name, email: user.email, image: user.image } });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) return res.status(401).json({error: 'No token provided'});


  try{
      const decoded = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ valid: true, user: decoded});
  }catch(err){

      if(err.name === 'TokenExpiredError'){
          return res.status(401).json({ valid: false, error: "Token has expired"});
      }
      res.status(401).json({ valid: false, error: 'Invalid Token!'})
  }
}

// Assuming you're using Express.js for your backend // Adjust this import according to your file structure

exports.getAvatarUrl = async (req, res) => {
  try {
    const userID = req.userID; // Assuming userID is set in the request object, possibly through middleware
    console.log(userID);
    // Fetch the user from the database
    const user = await User.findById(userID);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the avatar URL from the user object
    const avatarUrl = user.image || "/default-avatar.png"; // Fallback to a default image if not set

    // Send the avatar URL back in the response
    return res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
