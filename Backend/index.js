import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from './routes/auth.routes.js';
import connectDb from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],  
  credentials: true
}))
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRouter);

app.listen(PORT, () => {
  connectDb()
  console.log(`Server is running on port ${PORT}`);
});
export default app;