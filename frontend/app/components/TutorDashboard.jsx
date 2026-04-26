import { useState, useEffect } from "react";
import axios from "axios";
import { usePopup, PopupProvider } from "./Popup";
import "./TutorDashboard.css";

function TutorDashboard() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null); // ✅ NEW
  const { popup, showAlert, closePopup } = usePopup();

  const [form, setForm] = useState({
    tutorName: localStorage.getItem("name"),
    image: null,
    name: "",
    about: "",
    time: "",
    fee: "",
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);

        const myCourses = res.data.filter(
          (c) => c.tutorName === localStorage.getItem("name"),
        );

        setCourses(myCourses);
      } catch (err) {
        // Error handled
      }
    };

    fetchCourses();
  }, []);

  // 🚀 ADD / UPDATE COURSE
  const addCourse = async () => {
    try {
      const formData = new FormData();

      formData.append("tutorName", form.tutorName);
      formData.append("name", form.name);
      formData.append("about", form.about);
      formData.append("time", form.time);
      formData.append("fee", form.fee);
      formData.append("image", form.image);

      let res;

      if (editingId) {
        // 🔥 UPDATE
        res = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/courses/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        setCourses((prev) =>
          prev.map((c) => (c._id === editingId ? res.data : c)),
        );

        showAlert("Course Updated ✅", "✅ Update Success");
      } else {
        // ➕ ADD
        res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/courses/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        setCourses((prev) => [...prev, res.data]);
        await showAlert("Course Added ✅", "✅ Success");
      }

      // 🔄 RESET
      setEditingId(null);
      setForm({
        tutorName: localStorage.getItem("name"),
        image: null,
        name: "",
        about: "",
        time: "",
        fee: "",
      });

      setPreview(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error(err);
      await showAlert("Error adding course ❌", "❌ Failed");
    }
  };

  // ✏️ EDIT
  const handleEdit = (course) => {
    setEditingId(course._id); // ✅ IMPORTANT

    setForm({
      tutorName: localStorage.getItem("name"),
      image: null,
      name: course.name,
      about: course.about,
      time: course.time,
      fee: course.fee,
    });

    setPreview(`${import.meta.env.VITE_API_BASE_URL}${course.image}`);
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${id}`);

      setCourses((prev) => prev.filter((c) => c._id !== id));

      showAlert("Course Deleted ✅", "✅ Deleted");
    } catch (err) {
      console.error(err);
      showAlert("Error deleting ❌", "❌ Delete Failed");
    }
  };

  return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      {/* Running Text Banner */}
      <div className="RunningTextBanner TutorBanner">
        <div className="RunningTextContent">
          <span>💰 Accept Payment via Our Secure Platform 💰</span>
          <span className="separator"></span>
          <span>⭐ Build Your Reputation Through Student Ratings ⭐</span>
          <span className="separator"></span>
          <span>📈 More Ratings = More Student Reach 📈</span>
          <span className="separator"></span>
          <span>🚀 Boost Your Teaching Demand & Earnings 🚀</span>
          <span className="separator"></span>
          <span>⭐ Build Your Reputation Through Student Ratings ⭐</span>
        </div>
      </div>

      <div className="TutorCourseLayout">
      {/* COURSES GRID */}
      <div className="TutorCourseCardHeading">
        <h2>Your Added Courses</h2>
        <div className="TutorCourseCard">
          {courses.map((c, i) => (
            <div key={i} className="TutorCourseCardGrid">
              {courses.length === 0 && (
                <h4>You haven't added any courses yet</h4>
              )}
              <img
                src={
                  c.image
                    ? `${import.meta.env.VITE_API_BASE_URL}${c.image}`
                    : "https://via.placeholder.com/300x150"
                }
                alt="course"
                className="TutorDBCourseImg"
              />

              <h3>{c.name}</h3>
              <p className="desc">{c.about}</p>

              <div className="details">
                <p>
                  <b>⏰ Time:</b> {c.time}
                </p>
                <p>
                  <b>💰 Fee:</b> ₹{c.fee}
                </p>
              </div>

                <button className="CourseEdit-btn" onClick={() => handleEdit(c)}>✏️ Edit
                </button>

                <button
                  className="CourseDelete-btn"
                  onClick={() => handleDelete(c._id)}
                >
                  🗑 Delete
                </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / UPDATE FORM */}
      <div className="TutorCourseCardHeading">
        <h2>{editingId ? "Update Course" : "Add New Course"}</h2>
      <div className="TutorCourseForm">
        <div className="TutorCourseFormGrid">
          <p>Add Poster/Photo Here</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setForm({ ...form, image: file });

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="course-img"
              style={{ marginTop: "10px" }}
            />
          )}

          <input
            placeholder="Course Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="About Course"
            rows="3"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />

          <input
            placeholder="Time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <input
            placeholder="Fee"
            value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })}
          />

          <button className="btn" onClick={addCourse}>
            {editingId ? "Update Course" : "Add Course"}
          </button>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}

export default TutorDashboard;
