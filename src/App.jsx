import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EmailSender from "./components/EmailSender";
import AppHeader from "./components/Header";
import TemplateCreate from "./components/TemplateCreate"; 
import UsersManagement from "./components/Usermanagement";
import SettingsPage from "./components/Settings";
import ProfilePage from "./components/Profilepage";
import Login from "./components/Login";
import TemplateDetails from "./components/TemplateDetails";
import AllEmails from "./components/AllEmails";
import MyEmails from "./components/MyEmails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Prevents flashing

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    setIsLoading(false); // ✅ Set loading to false after checking auth
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading...</div>; // ✅ Prevents UI flickering
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-950">
        {/* ✅ Show Header only when logged in */}
        {isAuthenticated && <AppHeader userRole={userRole} isAuthenticated={isAuthenticated} onLogout={handleLogout} />}

        <main className="flex-grow">
          <Routes>
            {!isAuthenticated ? (
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            ) : (
              <>
                <Route path="/" element={<EmailSender />} />
                <Route path="/templates" element={<TemplateCreate />} />
                <Route path="/templates/:id" element={<TemplateDetails />} /> 
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/settings" element={<SettingsPage userRole={userRole} />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/emails" element={<AllEmails userRole={userRole} />} />
                <Route path="/myemails" element={<MyEmails userRole={userRole} />} />
              </>
            )}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
