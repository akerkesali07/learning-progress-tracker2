import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getGrades, getTranscript } from "../api/gradesApi";
import { FileText } from "lucide-react";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    getGrades()
      .then((data) => setGrades(data))
      .catch(() => setGrades([]))
      .finally(() => setLoading(false));

    getTranscript(userId)
      .then(setTranscript)
      .catch(() => setTranscript(null));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">
            <FileText className="page-icon" />
            Бағалар
          </h2>

          {loading ? (
            <p className="loading">Жүктелуде...</p>
          ) : grades.length === 0 ? (
            <p className="empty">Бағалар әлі енгізілмеген</p>
          ) : (
            <>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Пән</th>
                      <th>Тапсырма</th>
                      <th>Баға</th>
                      <th>Күні</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((item, i) => (
                      <tr key={item.id}>
                        <td>{i + 1}</td>
                        <td>{item.courseName}</td>
                        <td>{item.task}</td>
                        <td>{item.score}%</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transcript && (
                <div className="transcript-card">
                  <div className="transcript-header">
                    <h3>Транскрипт</h3>
                    <div className="average-grade">
                      Семестр бойынша орташа:{" "}
                      {transcript.average?.toFixed(2)}
                    </div>
                  </div>

                  {Object.keys(transcript.courses || {}).length === 0 ? (
                    <p className="transcript-empty">Пәндік бағалар әлі жоқ</p>
                  ) : (
                    <div className="course-list">
                      {Object.entries(transcript.courses).map(
                        ([course, avg]) => (
                          <div className="course-item" key={course}>
                            <span className="course-name">{course}</span>
                            <span
                              className={`course-average ${
                                avg < 50 ? "low" : avg < 75 ? "medium" : ""
                              }`}
                            >
                              Семестрдің орташа бағасы {avg.toFixed(1)}%
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}