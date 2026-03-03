import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getTimetableForUser } from "../api/timetableApi";

const DAYS = ["Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма"];
const LESSONS = [1, 2, 3, 4, 5, 6];

export default function Timetable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    getTimetableForUser(userId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const map = {};
  entries.forEach((item) => {
    const dayIndex = DAYS.indexOf(item.day);
    if (dayIndex === -1) return;
    const lessonIndex = LESSONS.indexOf(item.lessonNumber);
    if (lessonIndex === -1) return;
    const key = `${dayIndex}-${lessonIndex}`;
    map[key] = item;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">Менің кестем</h2>

          {loading ? (
            <p className="loading">Жүктелуде...</p>
          ) : entries.length === 0 ? (
            <p className="empty">Сабақ кестесі әлі енгізілмеген</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Күн</th>
                    {LESSONS.map((n) => (
                      <th key={n}>{n}-сабақ</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, dIndex) => (
                    <tr key={day}>
                      <td>{day}</td>
                      {LESSONS.map((lessonNumber, lIndex) => {
                        const key = `${dIndex}-${lIndex}`;
                        const cell = map[key];
                        return (
                          <td key={key}>
                            {cell ? (
                              <div className="schedule-cell-readonly">
                                <div className="schedule-course">{cell.courseName}</div>
                                <div className="schedule-meta">
                                  {cell.time} • {cell.room}
                                </div>
                                <div className="schedule-teacher">
                                  {cell.teacher}
                                </div>
                              </div>
                            ) : (
                              <span className="schedule-empty">—</span>
                            )}
                          </td>
                        );
                      })}
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