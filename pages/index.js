import { useEffect, useState } from "react";
import Login from "../components/Login";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    typeOfCourse: "",
    courseName: "",
    durationFrom: "",
    durationTo: "",
    institute: "",
    batch: "",
    about: "",
    additionalInfo: "",
    photo: "",
    studentId: ""
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Fetch all students from API
  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // Handle edit
  const handleEdit = (student) => {
    setForm({
      ...student,
      durationFrom: student.durationFrom?.slice(0, 10) || "",
      durationTo: student.durationTo?.slice(0, 10) || ""
    });
    setEditingId(student._id);
    setShowForm(true);
  };

  // Handle submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/students/${editingId}` : "/api/students";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const student = await res.json();

    if (editingId) {
      setStudents(students.map(s => s._id === student._id ? student : s));
    } else {
      setStudents([...students, student]);
    }

    setForm({
      studentId:"", firstName: "", lastName: "", typeOfCourse: "", courseName: "",
      durationFrom: "", durationTo: "", institute: "", batch: "",
      about: "", additionalInfo: "", photo: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    setStudents(students.filter(s => s._id !== id));
  };

  // QR code download
  const downloadQRCode = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
  };

  // Create unique groups by Institute + Batch
  const groups = [...new Map(students.map(s => [`${s.institute}___${s.batch}`, s])).values()]
    .map(s => ({ institute: s.institute, batch: s.batch }));

  // Filter students based on selected group
  const displayedStudents = selectedGroup
    ? students.filter(s => s.institute === selectedGroup.inst && s.batch === selectedGroup.batch)
    : students;

  // Show login form if not logged in
  if (!isLoggedIn) return <Login onLogin={setIsLoggedIn} />;

  return (
    <div style={{ padding: 20 }}>
      <h1>Student List</h1>
      <button onClick={() => { setShowForm(true); setEditingId(null); setForm({}) }}>Add Student</button>
      <button onClick={handleLogout} style={{ marginLeft: 20 }}>Logout</button>

      {/* Filter by unique Institute + Batch */}

      <div style={{ marginTop: 20 }}>
        <h3>Filter by Institute & Batch</h3>
        {groups.map(g => (
          <button key={`${g.institute}___${g.batch}`}
                  onClick={() => setSelectedGroup({ inst: g.institute, batch: g.batch })}
                  style={{ margin: "5px" }}>
            {g.institute} - {g.batch}
          </button>
        ))}
        <button onClick={() => setSelectedGroup(null)} style={{ margin: "5px" }}>Show All</button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: "#eee", padding: 20, border: "1px solid #ccc", marginTop: 20 }}>
          <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            {/* Show Student ID input only when adding a new student */}
{!editingId && (
  <div style={{ marginBottom: 10 }}>
    <label><strong>Student ID:</strong></label>
    <input
      type="text"
      placeholder="Enter Student ID"
      value={form.studentId || ""}
      onChange={e => setForm({ ...form, studentId: e.target.value })}
      required
      style={{ marginLeft: 10 }}
    />
  </div>
)}

            <input placeholder="First Name" value={form.firstName || ""} onChange={e => setForm({...form, firstName: e.target.value})} />
            <input placeholder="Last Name" value={form.lastName || ""} onChange={e => setForm({...form, lastName: e.target.value})} />
            <input placeholder="Type of Course" value={form.typeOfCourse || ""} onChange={e => setForm({...form, typeOfCourse: e.target.value})} />
            <input placeholder="Course Name" value={form.courseName || ""} onChange={e => setForm({...form, courseName: e.target.value})} />
            <input type="date" value={form.durationFrom || ""} onChange={e => setForm({...form, durationFrom: e.target.value})} />
            <input type="date" value={form.durationTo || ""} onChange={e => setForm({...form, durationTo: e.target.value})} />
            <input placeholder="Institute" value={form.institute || ""} onChange={e => setForm({...form, institute: e.target.value})} />
            <input placeholder="Batch" value={form.batch || ""} onChange={e => setForm({...form, batch: e.target.value})} />
            <textarea placeholder="About Student" value={form.about || ""} onChange={e => setForm({...form, about: e.target.value})} />
            <textarea placeholder="Additional Info" value={form.additionalInfo || ""} onChange={e => setForm({...form, additionalInfo: e.target.value})} />

            <input type="file" accept="image/*" onChange={async e => {
              const file = e.target.files[0];
              if(file) {
                const base64 = await toBase64(file);
                setForm({...form, photo: base64});
              }
            }} />
            {form.photo && <img src={form.photo} width="100" style={{ display:"block", marginTop:10 }}/>}
            <br/>
            <button type="submit">{editingId ? "Update" : "Save"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({}) }}>Cancel</button>
          </form>
        </div>
      )}

      {/* Student Table */}
      <table border="1" cellPadding="5" style={{ marginTop:20, borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th>Student ID</th><th>Name</th><th>Course</th><th>QR Code</th><th>Actions</th><th>Download QR</th>
          </tr>
        </thead>
        <tbody>
          {displayedStudents.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.courseName}</td>
              <td>{s.qrCode && <img src={s.qrCode} width="50"/>}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
              <td>
                {s.qrCode && (
                  <button onClick={() => downloadQRCode(s.qrCode, `${s.firstName}_${s.lastName}_QR.png`)}>
                    Download QR
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
