import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { getStats } from "../api/statsApi";
import {
  LayoutDashboard,
  BookOpenCheck,
  FileText,
  NotebookPen,
} from "lucide-react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStatsState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    Promise.all([
      api.get(`/dashboard/${userId}`),
      getStats(userId).catch(() => null),
    ])
      .then(([dashRes, statsRes]) => {
        setDashboard(dashRes.data);
        setStatsState(statsRes);
      })
      .catch(() => {
        setDashboard(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const overallAverage =
    dashboard && dashboard.overallAverage !== undefined
      ? dashboard.overallAverage.toFixed(1)
      : "—";

  const hoursFromCompleted =
    stats && typeof stats.completedHomeworks === "number"
      ? stats.completedHomeworks * 1 
      : 0;

  const dailyEntries =
    stats && stats.daily
      ? Object.entries(stats.daily).sort(([d1], [d2]) => d1.localeCompare(d2))
      : [];

  const maxCompleted =
    dailyEntries.length > 0
      ? Math.max(
          ...dailyEntries.map(
            ([, value]) => Number(value.completedCount) || 0
          ),
          1
        )
      : 1;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">
            <LayoutDashboard className="page-icon" />
            Басты бет
          </h2>

          {loading ? (
            <p className="loading">Жүктелуде...</p>
          ) : !dashboard ? (
            <p className="empty">Деректер табылмады</p>
          ) : (
            <>
              <div className="stats-grid">

                <div className="stat-card green">
                  <div className="stat-card-top">
                    <FileText className="stat-icon" />
                    <span>Орташа баға</span>
                  </div>
                  <p className="stat-value">{overallAverage}%</p>
                </div>

                {stats && (
                  <div className="stat-card purple">
                    <div className="stat-card-top">
                      <NotebookPen className="stat-icon" />
                      <span>Үй тапсырмалар прогресі</span>
                    </div>
                    <p className="stat-value">
                      {stats.completedHomeworks ?? 0} тапсырма /{" "}
                      {hoursFromCompleted.toFixed(1)} сағ
                    </p>
                    {typeof stats.totalStudyHours === "number" && (
                      <p className="stat-subtext">
                        (Нақты енгізілген уақыты:{" "}
                        {stats.totalStudyHours.toFixed(1)} сағ)
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="summary">
                <h3>Пәндер бойынша орташа баға</h3>
                {dashboard.subjectAverages &&
                Object.keys(dashboard.subjectAverages).length > 0 ? (
                  <ul>
                    {Object.entries(dashboard.subjectAverages).map(
                      ([subject, avg]) => (
                        <li key={subject}>
                          {subject}:{" "}
                          <strong>
                            {avg !== undefined ? avg.toFixed(1) : "—"}%
                          </strong>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>Бағалар әлі енгізілмеген</p>
                )}
              </div>

              <div className="chart-card">
                <h3>Үй тапсырмаларын орындау динамикасы</h3>
                {stats && dailyEntries.length > 0 ? (
                  <div className="bar-chart">
                    {dailyEntries.map(([date, value]) => {
                      const completed = Number(value.completedCount) || 0;
                      const widthPercent = (completed / maxCompleted) * 100;

                      return (
                        <div className="bar-row" key={date}>
                          <div className="bar-label">
                            {date}{" "}
                            <span className="bar-label-count">
                              ({completed} тап.)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Үй тапсырмалары бойынша график салуға дерек әлі жоқ</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}