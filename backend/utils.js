import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
   return jwt.sign(user.id, process.env.JWT_SECRET);
};
