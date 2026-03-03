import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";

export default function ResetPassword({ showNotification }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ email, code, newPassword });
      if (res.success) {
        showNotification &&
          showNotification("Құпиясөз сәтті өзгертілді", "success");
        navigate("/login");
      } else {
        showNotification &&
          showNotification(
            res.message || "Код қате немесе уақыты біткен",
            "error"
          );
      }
    } catch {
      showNotification && showNotification("Сервер қателігі", "error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Жаңа құпиясөз</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="6 таңбалы код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Жаңа құпиясөз"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        {/* Негізгі батырма */}
        <button type="submit">Құпиясөзді ауыстыру</button>

        {/* Артқа қайту */}
        <button
          type="button"
          className="auth-back-link"
          onClick={() => navigate(-1)}
        >
          ← Артқа қайту
        </button>
      </form>
    </div>
  );
}