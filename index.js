import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
import Auth from './routes/user.js';
import Review from './routes/review.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:['http://localhost:3000', 'https://thriving-fenglisu-1c4304.netlify.app'],
    credentials: true
}))
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err=>console.log(err));


app.use("/auth", Auth);
app.use("/review", Review); 

app.get("/", (req, res) => {
    res.write("Hello Kishan");
})

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
})