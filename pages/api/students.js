import { connectDB } from "../../lib/mongodb";
import Student from "../../models/Student";
import QRCode from "qrcode";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const students = await Student.find();
    return res.status(200).json(students);
  }

  if (req.method === "POST") {
    try {
      const data = req.body;

      // Generate QR code linking to /student/[id]
      const newStudent = await Student.create(data);
      const qrLink = `${process.env.NEXT_PUBLIC_BASE_URL}/student/${newStudent._id}`;
      const qrCode = await QRCode.toDataURL(qrLink);

      newStudent.qrCode = qrCode;
      await newStudent.save();

      res.status(201).json(newStudent);
    } catch (err) {
      res.status(500).json({ error: "Error saving student" });
    }
  }
}
