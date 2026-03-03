import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function Register({ showNotification }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showNotification && showNotification("Құпия сөздер сәйкес емес", "error");
      return;
    }
    try {
      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      if (res.success) {
        showNotification && showNotification("Тіркелу сәтті өтті", "success");
        navigate("/login");
      } else {
        showNotification &&
          showNotification(res.message || "Тіркелу кезінде қате", "error");
      }
    } catch {
      showNotification && showNotification("Сервермен байланыс жоқ", "error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Тіркелу</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Аты-жөні"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Құпия сөз"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Құпия сөзді растаңыз"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Тіркелу</button>
        <p>
          Аккаунтыңыз бар ма? <Link to="/login">Кіру</Link>
        </p>
      </form>
    </div>
  );
}