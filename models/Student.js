import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  studentId: String,
  photo: String, // optional, base64 or URL
  firstName: String,
  lastName: String,
  typeOfCourse: String,
  courseName: String,
  durationFrom: Date,
  durationTo: Date,
  institute: String,
  batch: String,
  about: String,
  additionalInfo: String,
  qrCode: String // QR code link
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
