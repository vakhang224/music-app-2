const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // lấy token sau 'Bearer '

  if (!token) return res.status(401).json({ message: 'Token không được cung cấp' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });

    req.user = user;
    next();
  });
}

module.exports = verifyToken;