import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log("Server starting...")
app.use(bodyParser.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../public")));

//get secret file
const dbUri = process.env.MONGO_DB_CONNECTION!;

//connection to db
mongoose.connect(dbUri).then(()=>{
  console.log('connected to db')
})
.catch((err:any)=>{
  console.log(err)
});



app.use('/api/auth', authRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

