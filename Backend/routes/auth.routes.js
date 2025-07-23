import express from 'express';
import { SingUp, Login, Logout } from '../controllers/auth.controllers.js';

const authRouter = express.Router();


authRouter.post("/signup",SingUp);
authRouter.post("/login",Login);
authRouter.get("/logout",Logout);
export default authRouter;