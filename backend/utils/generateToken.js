import jwt from 'jsonwebtoken';

// ست کردن JWT به صورت HTTP-only cookie
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false, // در production باید true شود
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 روز
  });
};

// تولید JWT به صورت string بدون ست کردن cookie (برای فرانت‌اند)
const generateTokenString = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
export { generateTokenString };

