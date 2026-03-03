import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/profileApi";
import {
  LayoutDashboard,
  BookOpenCheck,
  FileText,
  NotebookPen,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "student";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "admin") return;
    getUserProfile(userId)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isAdmin = role === "admin";

  // Мобилькада пунктқа басқанда меню жабылсын
  const handleNavClick = () => {
    if (window.innerWidth <= 700) {
      setIsMenuOpen(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-left">
        <div className="sidebar-top">
          <div className="logo">
            <ShieldCheck className="logo-icon" />
            <span>LPT</span>
          </div>

          {user && !isAdmin && (
            <div className="sidebar-user">
              <User className="sidebar-user-icon" />
              <div>
                <div className="sidebar-user-name">{user.fullName}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мобиль бургер батырма */}
      <button
        className={`sidebar-mobile-toggle ${
          isMenuOpen ? "sidebar-mobile-toggle-open" : ""
        }`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Навигацияны ашу"
      >
        <span className="burger-line" />
        <span className="burger-line" />
        <span className="burger-line" />
      </button>

      <nav
        className={
          "nav-menu" + (isMenuOpen ? " nav-menu-open" : "")
        }
      >
        {isAdmin ? (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <LayoutDashboard className="nav-icon" />
              <span>Admin панель</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <LayoutDashboard className="nav-icon" />
              <span>Басты бет</span>
            </NavLink>
            <NavLink
              to="/timetable"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <BookOpenCheck className="nav-icon" />
              <span>Кесте</span>
            </NavLink>
            <NavLink
              to="/grades"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <FileText className="nav-icon" />
              <span>Бағалар</span>
            </NavLink>
            <NavLink
              to="/homework"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <NotebookPen className="nav-icon" />
              <span>Үй тапсырмасы</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              onClick={handleNavClick}
            >
              <User className="nav-icon" />
              <span>Профиль</span>
            </NavLink>
          </>
        )}

        <button className="logout-inline" onClick={handleLogout}>
          <LogOut className="nav-icon" />
          <span>Шығу</span>
        </button>
      </nav>
    </aside>
  );
}