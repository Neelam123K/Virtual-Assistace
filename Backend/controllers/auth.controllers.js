import bcrypt from 'bcryptjs';
import getToken from '../config/token.js';
import User from '../models/user.model.js';

export const SingUp = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    console.log(req.body);
    const existEmail = await User.findOne({ email });
    console.log(existEmail);
    if (existEmail) {
      
      return res.status(400).json({ message: "Email already exists" });
    }

    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const  hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,password: hashedPassword, email
    });

    const token = await getToken(user._id);
    console.log(token);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure:false, // Set to true if using HTTPS
    })

    return res.status(201).json(user)

  } catch (error) {
    return res.status(500).json({ message: `sign up error $(error)` });
  }
}



// login controller
export const Login = async (req, res) => {
  try{
    const {email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exists" });
    }

    const isMach = await bcrypt.compare(password, user.password);
    if (!isMach) {
      return res.status(400).json({ message: "Invalid password" });
    }


    const token = await getToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure:false, // Set to true if using HTTPS
    })

    return res.status(200).json(user)

  } catch (error) {
    return res.status(500).json({ message: `login error $(error)` });
  }
}

export const Logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: `logout error $(error)` });
  }
} 