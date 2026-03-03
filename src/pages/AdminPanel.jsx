import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAdminUsers,
  getAdminCourses,
  getAdminGrades,
  searchUsers,
  searchCourses,
  addAdminCourse,
  addAdminGrade,
  updateAdminCourse,
  deleteAdminCourse,
  saveTimetable,
  getTimetableForUserAdmin,
  clearTimetableForUser,
  getAdminHomeworksByUser,
  addAdminHomework,
  updateAdminHomework,
  deleteAdminHomework,
  updateAdminGrade,
  deleteAdminGrade,
} from "../api/adminApi";

const DAYS = ["Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма"];
const LESSONS = [1, 2, 3, 4, 5, 6];

export default function AdminPanel({ showNotification }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [newCourse, setNewCourse] = useState({ name: "", teacher: "" });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState({ name: "", teacher: "" });

  const [newGrade, setNewGrade] = useState({
    courseName: "",
    task: "",
    score: "",
    date: "",
    userId: "",
  });
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editingGrade, setEditingGrade] = useState({
    courseName: "",
    task: "",
    score: "",
    date: "",
    userId: "",
  });

  const [homeworks, setHomeworks] = useState([]);
  const [newHomework, setNewHomework] = useState({
    subject: "",
    title: "",
    dueDate: "",
    status: "TODO",
  });
  const [editingHomeworkId, setEditingHomeworkId] = useState(null);
  const [editingHomework, setEditingHomework] = useState({
    subject: "",
    title: "",
    dueDate: "",
    status: "TODO",
  });

  const [selectedUserIds, setSelectedUserIds] = useState([]); 
  const [schedule, setSchedule] = useState({});
  const [activeUserId, setActiveUserId] = useState(null); 
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    getAdminUsers()
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          setActiveUserId(data[0].id);
          setActiveUser(data[0]);
        }
      })
      .catch(() => setUsers([]));

    getAdminCourses().then(setCourses).catch(() => setCourses([]));
    getAdminGrades().then(setGrades).catch(() => setGrades([]));
  }, []);


  useEffect(() => {
    if (!activeUserId) return;

    getAdminHomeworksByUser(activeUserId)
      .then(setHomeworks)
      .catch(() => setHomeworks([]));

    loadTimetableForActiveUser(false); 

  }, [activeUserId]);

  const notify = (msg, type = "info") => {
    if (showNotification) showNotification(msg, type);
    else if (type === "error") alert(msg);
  };

  const handleUserSearch = async () => {
    try {
      if (!userSearch) {
        const all = await getAdminUsers();
        setUsers(all);
      } else {
        const filtered = await searchUsers(userSearch);
        setUsers(filtered);
      }
    } catch {
      notify("Пайдаланушыларды алу кезінде қате", "error");
    }
  };

  const handleCourseSearch = async () => {
    try {
      if (!courseSearch) {
        const all = await getAdminCourses();
        setCourses(all);
      } else {
        const filtered = await searchCourses(courseSearch);
        setCourses(filtered);
      }
    } catch {
      notify("Пәндерді алу кезінде қате", "error");
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.teacher) {
      notify("Пән атауы мен мұғалім атын енгізіңіз", "error");
      return;
    }
    try {
      await addAdminCourse(newCourse);
      notify("Пән сәтті қосылды", "success");
      setNewCourse({ name: "", teacher: "" });
      const updated = await getAdminCourses();
      setCourses(updated);
    } catch (e) {
      notify(e.response?.data?.error || "Пән қосу кезінде қате", "error");
    }
  };

  const startEditCourse = (course) => {
    setEditingCourseId(course.id);
    setEditingCourse({ name: course.name, teacher: course.teacher });
  };

  const cancelEditCourse = () => {
    setEditingCourseId(null);
    setEditingCourse({ name: "", teacher: "" });
  };

  const handleSaveCourse = async () => {
    if (!editingCourseId) return;
    if (!editingCourse.name || !editingCourse.teacher) {
      notify("Пән атауы мен мұғалім атын толтырыңыз", "error");
      return;
    }
    try {
      await updateAdminCourse(editingCourseId, editingCourse);
      notify("Пән жаңартылды", "success");
      const updated = await getAdminCourses();
      setCourses(updated);
      cancelEditCourse();
    } catch (e) {
      notify(e.response?.data?.error || "Пәнді жаңарту кезінде қате", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Бұл пәнді өшіруді растайсыз ба?")) return;
    try {
      await deleteAdminCourse(id);
      const updated = await getAdminCourses();
      setCourses(updated);
      notify("Пән өшірілді", "success");
    } catch (e) {
      notify(e.response?.data?.error || "Пәнді өшіру кезінде қате", "error");
    }
  };


  const handleAddGrade = async () => {
    if (!newGrade.userId || !newGrade.courseName || !newGrade.score) {
      notify("Студент, пән және баға толтырылуы керек", "error");
      return;
    }
    try {
      await addAdminGrade({
        ...newGrade,
        score: Number(newGrade.score),
      });
      notify("Баға енгізілді", "success");
      setNewGrade({
        courseName: "",
        task: "",
        score: "",
        date: "",
        userId: "",
      });
      const updated = await getAdminGrades();
      setGrades(updated);
    } catch (e) {
      notify(e.response?.data?.error || "Баға енгізу кезінде қате", "error");
    }
  };

  const startEditGrade = (grade) => {
    setEditingGradeId(grade.id);
    setEditingGrade({
      courseName: grade.courseName,
      task: grade.task,
      score: grade.score,
      date: grade.date,
      userId: grade.userId,
    });
  };

  const cancelEditGrade = () => {
    setEditingGradeId(null);
    setEditingGrade({
      courseName: "",
      task: "",
      score: "",
      date: "",
      userId: "",
    });
  };

  const handleSaveGrade = async () => {
    if (!editingGradeId) return;
    if (!editingGrade.userId || !editingGrade.courseName || !editingGrade.score) {
      notify("Студент, пән және баға толтырылуы керек", "error");
      return;
    }
    try {
      await updateAdminGrade(editingGradeId, {
        ...editingGrade,
        score: Number(editingGrade.score),
      });
      notify("Баға жаңартылды", "success");
      const updated = await getAdminGrades();
      setGrades(updated);
      cancelEditGrade();
    } catch (e) {
      notify(e.response?.data?.error || "Бағаны жаңарту кезінде қате", "error");
    }
  };

  const handleDeleteGrade = async (id) => {
    if (!window.confirm("Бұл бағаны өшіруді растайсыз ба?")) return;
    try {
      await deleteAdminGrade(id);
      const updated = await getAdminGrades();
      setGrades(updated);
      notify("Баға өшірілді", "success");
    } catch (e) {
      notify(e.response?.data?.error || "Бағаны өшіру кезінде қате", "error");
    }
  };

  const gradesForActiveUser = activeUserId
    ? grades.filter((g) => g.userId === activeUserId)
    : grades;


  const handleAddHomework = async () => {
    if (!activeUserId) {
      notify("Алдымен студент таңдаңыз", "error");
      return;
    }
    if (!newHomework.subject || !newHomework.title || !newHomework.dueDate) {
      notify("Пән, тақырып және мерзім толтырылуы керек", "error");
      return;
    }
    try {
      await addAdminHomework({
        ...newHomework,
        userId: activeUserId,
      });
      notify("Үй тапсырмасы қосылды", "success");
      setNewHomework({ subject: "", title: "", dueDate: "", status: "TODO" });
      const updated = await getAdminHomeworksByUser(activeUserId);
      setHomeworks(updated);
    } catch (e) {
      notify(
        e.response?.data?.error || "Үй тапсырмасын қосу кезінде қате",
        "error"
      );
    }
  };

  const startEditHomework = (hw) => {
    setEditingHomeworkId(hw.id);
    setEditingHomework({
      subject: hw.subject,
      title: hw.title,
      dueDate: hw.dueDate,
      status: hw.status,
    });
  };

  const cancelEditHomework = () => {
    setEditingHomeworkId(null);
    setEditingHomework({
      subject: "",
      title: "",
      dueDate: "",
      status: "TODO",
    });
  };

  const handleSaveHomework = async () => {
    if (!editingHomeworkId) return;
    if (!editingHomework.subject || !editingHomework.title || !editingHomework.dueDate) {
      notify("Пән, тақырып және мерзім толтырылуы керек", "error");
      return;
    }
    try {
      await updateAdminHomework(editingHomeworkId, {
        ...editingHomework,
        userId: activeUserId,
      });
      notify("Үй тапсырмасы жаңартылды", "success");
      const updated = await getAdminHomeworksByUser(activeUserId);
      setHomeworks(updated);
      cancelEditHomework();
    } catch (e) {
      notify(
        e.response?.data?.error || "Үй тапсырмасын жаңарту кезінде қате",
        "error"
      );
    }
  };

  const handleDeleteHomework = async (id) => {
    if (!window.confirm("Бұл үй тапсырмасын өшіруді растайсыз ба?")) return;
    try {
      await deleteAdminHomework(id);
      const updated = await getAdminHomeworksByUser(activeUserId);
      setHomeworks(updated);
      notify("Үй тапсырмасы өшірілді", "success");
    } catch (e) {
      notify(
        e.response?.data?.error || "Үй тапсырмасын өшіру кезінде қате",
        "error"
      );
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleScheduleCellChange = (dayIndex, lessonIndex, field, value) => {
    const key = `${dayIndex}-${lessonIndex}`;
    setSchedule((prev) => ({
      ...prev,
      [key]: {
        courseName: prev[key]?.courseName || "",
        room: prev[key]?.room || "",
        time: prev[key]?.time || "",
        teacher: prev[key]?.teacher || "",
        [field]: value,
      },
    }));
  };

  const handleSaveTimetable = async () => {
    if (selectedUserIds.length === 0) {
      notify("Кем дегенде бір студент таңдаңыз", "error");
      return;
    }

    const items = [];
    DAYS.forEach((day, dIndex) => {
      LESSONS.forEach((lessonNumber, lIndex) => {
        const key = `${dIndex}-${lIndex}`;
        const cell = schedule[key];
        if (cell && cell.courseName && cell.courseName.trim() !== "") {
          items.push({
            day,
            lessonNumber,
            courseName: cell.courseName,
            room: cell.room || "",
            time: cell.time || "",
            teacher: cell.teacher || "",
          });
        }
      });
    });

    if (items.length === 0) {
      notify("Кестеге кем дегенде бір сабақ енгізіңіз", "error");
      return;
    }

    try {
      await saveTimetable({ userIds: selectedUserIds, items });
      notify("Кесте сақталды", "success");
    } catch (e) {
      notify(e.response?.data?.error || "Кестені сақтау кезінде қате", "error");
    }
  };

  const loadTimetableForActiveUser = async (withNotify = true) => {
    if (!activeUserId) {
      if (withNotify) notify("Алдымен студент таңдаңыз", "error");
      return;
    }
    try {
      const data = await getTimetableForUserAdmin(activeUserId);
      const map = {};
      data.forEach((item) => {
        const dayIndex = DAYS.indexOf(item.day);
        const lessonIndex = LESSONS.indexOf(item.lessonNumber);
        if (dayIndex === -1 || lessonIndex === -1) return;
        const key = `${dayIndex}-${lessonIndex}`;
        map[key] = {
          courseName: item.courseName || "",
          room: item.room || "",
          time: item.time || "",
          teacher: item.teacher || "",
        };
      });
      setSchedule(map);
      if (withNotify) notify("Кесте жүктелді", "success");
    } catch {
      setSchedule({});
      if (withNotify) notify("Кестені жүктеу кезінде қате", "error");
    }
  };

  const handleClearTimetable = async () => {
    if (!activeUserId) {
      notify("Алдымен студент таңдаңыз", "error");
      return;
    }
    if (!window.confirm("Осы студенттің кестесін толық өшіруді растайсыз ба?"))
      return;

    try {

      await clearTimetableForUser(activeUserId);


      setSchedule({});
      notify("Кесте толық өшірілді", "success");
    } catch (e) {
      notify(
        e.response?.data?.error || "Кестені өшіру кезінде қате",
        "error"
      );
    }
  };

  const handleSelectActiveUser = (u) => {
    setActiveUserId(u.id);
    setActiveUser(u);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">Admin панель</h2>

          <div className="admin-grid">
            <section className="admin-card">
              <div className="card-header-row">
                <h3>Пайдаланушылар</h3>
                {activeUser && (
                  <span className="badge">
                    Таңдалған: {activeUser.fullName} ({activeUser.email})
                  </span>
                )}
              </div>
              <div className="search-row">
                <input
                  placeholder="Аты немесе email"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <button onClick={handleUserSearch}>Іздеу</button>
              </div>
              <ul className="user-list">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className={`user-row-main ${
                      activeUserId === u.id ? "user-row-active" : ""
                    }`}
                    onClick={() => handleSelectActiveUser(u)}
                  >
                    <div>
                      <strong>{u.fullName}</strong>
                    </div>
                    <div className="user-id-line">
                      <span>{u.email}</span>
                      <span className="user-id">ID: {u.id}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-card">
              <h3>Пәндер</h3>
              <div className="search-row">
                <input
                  placeholder="Пән немесе мұғалім"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
                <button onClick={handleCourseSearch}>Іздеу</button>
              </div>

              <ul className="course-list">
                {courses.map((c) => (
                  <li key={c.id} className="course-row">
                    {editingCourseId === c.id ? (
                      <div className="course-edit-inline">
                        <input
                          value={editingCourse.name}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          value={editingCourse.teacher}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              teacher: e.target.value,
                            })
                          }
                        />
                        <div className="course-edit-buttons">
                          <button onClick={handleSaveCourse}>Сақтау</button>
                          <button onClick={cancelEditCourse}>Бас тарту</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <strong>{c.name}</strong> — {c.teacher}
                        </div>
                        <div className="course-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => startEditHomework(hw)}>Өзгерту</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteHomework(hw.id)}>Өшіру</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="form-group">
                <input
                  placeholder="Пән атауы"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
                <input
                  placeholder="Мұғалім аты"
                  value={newCourse.teacher}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, teacher: e.target.value })
                  }
                />
                <button onClick={handleAddCourse}>Пән қосу</button>
              </div>
            </section>

            <section className="admin-card">
              <h3>Баға енгізу / өзгерту</h3>
              <div className="form-group">
                <select
                  value={newGrade.userId}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, userId: e.target.value })
                  }
                >
                  <option value="">Студент таңдаңыз</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>

                <select
                  value={newGrade.courseName}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, courseName: e.target.value })
                  }
                >
                  <option value="">Пән таңдаңыз</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.teacher})
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Тапсырма атауы"
                  value={newGrade.task}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, task: e.target.value })
                  }
                />
                <input
                  placeholder="Баға (0-100)"
                  type="number"
                  value={newGrade.score}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, score: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={newGrade.date}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, date: e.target.value })
                  }
                />
                <button onClick={handleAddGrade}>Баға қосу</button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Студент</th>
                      <th>Пән</th>
                      <th>Тапсырма</th>
                      <th>Баға</th>
                      <th>Күні</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesForActiveUser.map((g) =>
                      editingGradeId === g.id ? (
                        <tr key={g.id} className="editing-row">
                          <td>
                            <select
                              value={editingGrade.userId}
                              onChange={(e) =>
                                setEditingGrade({
                                  ...editingGrade,
                                  userId: e.target.value,
                                })
                              }
                            >
                              <option value="">Студент</option>
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.fullName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              value={editingGrade.courseName}
                              onChange={(e) =>
                                setEditingGrade({
                                  ...editingGrade,
                                  courseName: e.target.value,
                                })
                              }
                            >
                              <option value="">Пән</option>
                              {courses.map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              value={editingGrade.task}
                              onChange={(e) =>
                                setEditingGrade({
                                  ...editingGrade,
                                  task: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editingGrade.score}
                              onChange={(e) =>
                                setEditingGrade({
                                  ...editingGrade,
                                  score: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={editingGrade.date}
                              onChange={(e) =>
                                setEditingGrade({
                                  ...editingGrade,
                                  date: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <button onClick={handleSaveGrade}>Сақтау</button>
                            <button onClick={cancelEditGrade}>Болдырмау</button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={g.id}>
                          <td>{g.userId}</td>
                          <td>{g.courseName}</td>
                          <td>{g.task}</td>
                          <td>{g.score}</td>
                          <td>{g.date}</td>
                          <td>
                            <button onClick={() => startEditGrade(g)}>
                              Өзгерту
                            </button>
                            <button onClick={() => handleDeleteGrade(g.id)}>
                              Өшіру
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-card">
              <h3>Үй тапсырмалары (таңдалған студент)</h3>

              <div className="form-group">
                <input
                  placeholder="Пән"
                  value={newHomework.subject}
                  onChange={(e) =>
                    setNewHomework({ ...newHomework, subject: e.target.value })
                  }
                />
                <input
                  placeholder="Тақырып"
                  value={newHomework.title}
                  onChange={(e) =>
                    setNewHomework({ ...newHomework, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={newHomework.dueDate}
                  onChange={(e) =>
                    setNewHomework({ ...newHomework, dueDate: e.target.value })
                  }
                />
                <select
                  value={newHomework.status}
                  onChange={(e) =>
                    setNewHomework({ ...newHomework, status: e.target.value })
                  }
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                <button onClick={handleAddHomework}>Үй тапсырмасын қосу</button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Пән</th>
                      <th>Тақырып</th>
                      <th>Мерзімі</th>
                      <th>Күйі</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeworks.map((hw) =>
                      editingHomeworkId === hw.id ? (
                        <tr key={hw.id} className="editing-row">
                          <td>
                            <input
                              value={editingHomework.subject}
                              onChange={(e) =>
                                setEditingHomework({
                                  ...editingHomework,
                                  subject: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              value={editingHomework.title}
                              onChange={(e) =>
                                setEditingHomework({
                                  ...editingHomework,
                                  title: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={editingHomework.dueDate}
                              onChange={(e) =>
                                setEditingHomework({
                                  ...editingHomework,
                                  dueDate: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <select
                              value={editingHomework.status}
                              onChange={(e) =>
                                setEditingHomework({
                                  ...editingHomework,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="TODO">TODO</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="DONE">Done</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={handleSaveHomework}>Сақтау</button>
                            <button onClick={cancelEditHomework}>
                              Болдырмау
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={hw.id}>
                          <td>{hw.subject}</td>
                          <td>{hw.title}</td>
                          <td>{hw.dueDate}</td>
                          <td>{hw.status}</td>
                          <td>
                            <button onClick={() => startEditHomework(hw)}>
                              Өзгерту
                            </button>
                            <button onClick={() => handleDeleteHomework(hw.id)}>
                              Өшіру
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-card">
              <div className="timetable-header-row">
                <h3>Сабақ кестесі (5 күн × 6 сабақ)</h3>
                <div className="timetable-controls">
                  <button className="btn btn-outline" onClick={() => loadTimetableForActiveUser(true)}>Таңдалған студент кестесін жүктеу</button>
                  <button className="btn btn-danger" onClick={handleClearTimetable}>Кестені тазалау</button>
                </div>
              </div>

              <p className="info-text">
                Төмендегі checkbox арқылы бірнеше студентті таңдап, бірдей
                кестені бәріне бірден сақтай аласыз.
              </p>

              <div className="schedule-users">
                {users.map((u) => (
                  <label key={u.id} className="schedule-user-row">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u.id)}
                      onChange={() => toggleUserSelection(u.id)}
                    />
                    <span>
                      {u.fullName} {u.groupName ? `(${u.groupName})` : ""}
                    </span>
                  </label>
                ))}
              </div>

              <div className="schedule-grid">
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
                            const cell = schedule[key] || {};
                            return (
                              <td key={key}>
                                <div className="schedule-cell">
                                  <select
                                    value={cell.courseName || ""}
                                    onChange={(e) =>
                                      handleScheduleCellChange(
                                        dIndex,
                                        lIndex,
                                        "courseName",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Пән</option>
                                    {courses.map((c) => (
                                      <option key={c.id} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    placeholder="Аудитория"
                                    value={cell.room || ""}
                                    onChange={(e) =>
                                      handleScheduleCellChange(
                                        dIndex,
                                        lIndex,
                                        "room",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    placeholder="Уақыты"
                                    value={cell.time || ""}
                                    onChange={(e) =>
                                      handleScheduleCellChange(
                                        dIndex,
                                        lIndex,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    placeholder="Мұғалім"
                                    value={cell.teacher || ""}
                                    onChange={(e) =>
                                      handleScheduleCellChange(
                                        dIndex,
                                        lIndex,
                                        "teacher",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button className="primary-btn" onClick={handleSaveTimetable}>
                Кестені сақтау (таңдалған студенттерге)
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}