import jwt from 'jsonwebtoken';
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.TEST, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure:false, // Use secure cookies in production
    sameSite: 'strict', 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;