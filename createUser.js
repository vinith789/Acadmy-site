import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createUser() {
  await mongoose.connect(MONGODB_URI);
  const password = "admin123"; // choose your password
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: "admin123@gmail.com",
    password: hashed
  });

  console.log("User created:", user);
  mongoose.disconnect();
}

createUser();
