import { connectDB } from "../../../lib/mongodb";
import Student from "../../../models/Student";
import QRCode from "qrcode";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(student);
  }

  if (req.method === "PUT") {
    try {
      const data = req.body;
      const student = await Student.findByIdAndUpdate(id, data, { new: true });

      const qrLink = `${process.env.NEXT_PUBLIC_BASE_URL}/student/${student._id}`;
      student.qrCode = await QRCode.toDataURL(qrLink);
      await student.save();

      res.status(200).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating student" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Student.findByIdAndDelete(id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting student" });
    }
  }
}
