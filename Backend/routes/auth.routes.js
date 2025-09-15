import express from 'express';
import { SignUp, Login, LogOut } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post("/signup",SignUp);
authRouter.post("/signin",Login);
authRouter.get("/logout",LogOut);
export default authRouter;