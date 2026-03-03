import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Grades from "./pages/Grades";
import Profile from "./pages/Profile";
import Homework from "./pages/Homework";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notification from "./components/Notification";
import Timetable from "./pages/Timetable";

function App() {
  const [notification, setNotification] = React.useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <Router>
      <Notification notification={notification} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login showNotification={showNotification} />} />
        <Route path="/register" element={<Register showNotification={showNotification} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword showNotification={showNotification} />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword showNotification={showNotification} />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <PrivateRoute>
              <Grades />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile showNotification={showNotification} />
            </PrivateRoute>
          }
        />
        <Route
          path="/homework"
          element={
            <PrivateRoute>
              <Homework />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel showNotification={showNotification} />
            </PrivateRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <PrivateRoute>
              <Timetable />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;