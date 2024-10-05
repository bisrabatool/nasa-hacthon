const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    let decoded;
    if (token.includes('google')) {
      decoded = jwt.verify(token, process.env.JWT_GOOGLE_SECRET);
    } else {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
