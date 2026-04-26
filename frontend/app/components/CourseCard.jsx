import "./CourseCard.css";

export default function TutorCard({ course }) {
  return (
    <div className="card">
      <h3>{course.name}</h3>
      <p>{course.about}</p>
      <p><b>Time:</b> {course.time}</p>
      <p><b>Fee:</b> ₹{course.fee}</p>
      <p><b>Mobile:</b> {course.mobile}</p>
      <button onClick={() => alert("Message sent to tutor")}>Contact</button>
    </div>
  );
}
