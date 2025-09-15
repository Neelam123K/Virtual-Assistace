import jwt from 'jsonwebtoken';


const isAuth=async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "token does not found" });
    }
    const VerifyToken =await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = VerifyToken.userId

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error in auth" });
  }
} 

export default isAuth;