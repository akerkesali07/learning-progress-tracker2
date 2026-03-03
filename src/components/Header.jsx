import { useEffect, useState } from "react";
import { getUserProfile } from "../api/profileApi";
import { User as UserIcon } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    getUserProfile(userId)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="header">
      <div className="header-title">
        <h1>Learning Progress Tracker</h1>
      </div>
      <div className="user-info">
        <span className="greeting">
          <UserIcon className="header-icon" />
          {user ? user.fullName : ""}
        </span>
      </div>
    </header>
  );
}