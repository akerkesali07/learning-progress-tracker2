import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getHomeworks } from "../api/homeworkApi";
import { NotebookPen } from "lucide-react";

export default function Homework() {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeworks()
      .then(setHomeworks)
      .catch(() => setHomeworks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">
            <NotebookPen className="page-icon" />
            Үй тапсырмалары
          </h2>

          {loading ? (
            <p className="loading">Жүктелуде...</p>
          ) : homeworks.length === 0 ? (
            <p className="empty">Үй тапсырмалары әлі жоқ</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Пән</th>
                    <th>Тақырып</th>
                    <th>Мерзімі</th>
                    <th>Күйі</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map((hw, i) => (
                    <tr key={hw.id}>
                      <td>{i + 1}</td>
                      <td>{hw.subject}</td>
                      <td>{hw.title}</td>
                      <td>{hw.dueDate}</td>
                      <td>{hw.status}</td>
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