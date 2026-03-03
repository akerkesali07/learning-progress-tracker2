import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getUserProfile, updateUserProfile } from "../api/profileApi";
import { User as UserIcon } from "lucide-react";

export default function Profile({ showNotification }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    major: "",
    groupName: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Пайдаланушы жүйеге кірмеген");
      setLoading(false);
      return;
    }

    getUserProfile(userId)
      .then((data) => {
        setUser(data);
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          major: data.major || "",
          groupName: data.groupName || "",
          password: "",
        });
      })
      .catch(() => setError("Сервер қателігі"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      const updated = await updateUserProfile(user.id, form);
      setUser(updated);
      setForm((prev) => ({ ...prev, password: "" }));
      showNotification && showNotification("Профиль сәтті жаңартылды", "success");
    } catch {
      showNotification && showNotification("Жаңарту кезінде қате", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2 className="page-title">
            <UserIcon className="page-icon" />
            Профиль
          </h2>

          {loading ? (
            <p className="info-text">Жүктелуде...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-row">
                <label>Аты-жөні</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Мамандығы</label>
                <input
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Тобы</label>
                <input
                  name="groupName"
                  value={form.groupName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <label>Жаңа құпиясөз (қаласаңыз)</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? "Сақталуда..." : "Сақтау"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}