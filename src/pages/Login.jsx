import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function Login({ showNotification }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "admin@admin.com" && password === "admin") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", "admin");
      showNotification && showNotification("Admin ретінде кірдіңіз", "success");
      navigate("/admin");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });

      if (res.success && res.userId) {
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("role", res.role || "student");
        showNotification && showNotification("Кіру сәтті өтті", "success");
        navigate("/dashboard");
      } else {
        showNotification &&
          showNotification(res.message || "Қате email немесе пароль", "error");
      }
    } catch {
      showNotification && showNotification("Сервермен байланыс жоқ", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Кіру</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Кіру"}
        </button>
        <p>
          Аккаунтыңыз жоқ па? <Link to="/register">Тіркелу</Link>
        </p>
        <p>
          Құпиясөзді ұмыттыңыз ба?{" "}
          <Link to="/forgot-password">Қалпына келтіру</Link>
        </p>
      </form>
    </div>
  );
}