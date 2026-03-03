import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getCoursesByUser } from "../api/coursesApi";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    getCoursesByUser(userId)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">Сабақтар</h2>
          {loading ? (
            <p className="loading">Жүктелуде...</p>
          ) : courses.length === 0 ? (
            <p className="empty">Сабақтар табылмады</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Пән</th>
                    <th>Мұғалім</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}