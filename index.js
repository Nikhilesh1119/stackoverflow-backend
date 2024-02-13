import express from "express";
import cors from "cors";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import chatbotRoutes from "./routes/Chatbot.js";
import {configDB} from "./config/connectDB.js";
import userRoutes from "./routes/Users.js";
import otpRoutes from './routes/Otp.js';
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/chatbot", chatbotRoutes)
app.use('/otp', otpRoutes);

app.get('/', (req, res) => {
  res.send("This is a stack overflow clone's API by Nikhilesh Chouhan")
})
app.listen(process.env.PORT, () => {
  configDB();
  console.log(`Server running on port ${process.env.PORT}`)
})

