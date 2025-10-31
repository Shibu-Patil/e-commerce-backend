const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');


    req.userId = decoded.id;
    req.role = decoded.role || 'user';
    req.isAdmin = decoded.role === 'admin' || decoded.isAdmin === true;

    next(); 
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
