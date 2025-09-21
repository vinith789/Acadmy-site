import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StudentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if(id){
      fetch(`/api/students/${id}`)
        .then(res=>res.json())
        .then(setStudent);
    }
  }, [id]);

  if(!student) return <p>Loading...</p>;

  return (
    <div style={{ padding:20 }}>
      <h1>{student.firstName} {student.lastName}</h1>
      {student.photo && <img src={student.photo} width="150"/>}
      <p><b>Course:</b> {student.courseName} ({student.typeOfCourse})</p>
      <p><b>Duration:</b> {student.durationFrom?.slice(0,10)} - {student.durationTo?.slice(0,10)}</p>
      <p><b>Institute:</b> {student.institute}</p>
      <p><b>Batch:</b> {student.batch}</p>
      <p><b>About:</b> {student.about}</p>
      <p><b>Additional Info:</b> {student.additionalInfo}</p>
    </div>
  );
}
