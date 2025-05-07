// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    // Log the secret for debugging (remove in production)
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token
  console.log("JWT_SECRET:", token);  // Log the token for debugging (remove in production)

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err){ 
      console.error("Token verification error:", err);  // Log the error for debugging
      return res.status(403).json({ message: 'Invalid or expired token.' });}
      console.log("user authenticated", user.id);
    req.user = user.id;  // Attach user information to request
    next();  // Pass control to the next middleware
  });
};

export default authenticateJWT;
