// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this is securely stored in production

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try{
    const decoded = jwt.verify(token,secret);
    console.log("this was ran!")
    req.userID = decoded.id;
    console.assert("Authorized");
    console.log(decoded);
    next();
  }catch(err){
    res.status(401).json({ error: 'Invalid token' , err});

  }

};

module.exports = authenticateToken;
