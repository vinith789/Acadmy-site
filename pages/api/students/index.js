import { connectDB } from "../../../lib/mongodb";
import Student from "../../../models/Student";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { nanoid } from "nanoid"; // <-- add this

export default async function handler(req, res) {
  await connectDB();

  // check token
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (req.method === "GET") {
    const students = await Student.find();
    return res.status(200).json(students);
  }

if (req.method === "POST") {
  try {
    const data = req.body;

    if (!data.studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const newStudent = await Student.create({
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      typeOfCourse: data.typeOfCourse,
      courseName: data.courseName,
      durationFrom: data.durationFrom,
      durationTo: data.durationTo,
      institute: data.institute,
      batch: data.batch,
      about: data.about,
      additionalInfo: data.additionalInfo,
      photo: data.photo
    });

    const qrLink = `${process.env.NEXT_PUBLIC_BASE_URL}/student/${newStudent._id}`;
    newStudent.qrCode = await QRCode.toDataURL(qrLink);
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating student" });
  }
}
else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
