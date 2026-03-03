import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword({ showNotification }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
      showNotification &&
        showNotification(
          "Егер email жүйеде болса, код почтаға жіберілді",
          "success"
        );
    } catch {
      showNotification && showNotification("Сервер қателігі", "error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Құпиясөзді қалпына келтіру</h2>

        <input
          type="email"
          placeholder="Тіркелген email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        
        <button type="submit">Код жіберу</button>

        <button
          type="button"
          className="auth-back-link"
          onClick={() => navigate(-1)}
        >
          ← Артқа қайту
        </button>

        {sent && (
          <p className="info-text">
            Егер email жүйеде болса, 6 таңбалы код почтаға жіберілді.
          </p>
        )}
        <p>
          Код дайын ба? <Link to="/reset-password">Құпиясөзді ауыстыру</Link>
        </p>
      </form>
    </div>
  );
}