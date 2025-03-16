import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiMail, FiUser, FiChevronDown, FiSettings, FiLogOut, FiMenu, FiX 
} from "react-icons/fi";

const AppHeader = ({ userRole, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FiMail className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">JSISender</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden ml-4 text-gray-300 hover:text-white focus:outline-none"
            >
              {showMobileMenu ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            {/* My Emails (Visible to All Users) */}
            <Link
              to="/myemails"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/my-emails" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              My Emails
            </Link>

            {/* All Emails (Only Admin & Owner) */}
            {(userRole === "admin" || userRole === "owner") && (
              <Link
                to="/emails"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/all-emails" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                All Emails
              </Link>
            )}

            {(userRole === "admin" || userRole === "owner") && (
              <>
                <Link
                  to="/templates"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/templates" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Templates
                </Link>
                <Link
                  to="/users"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/users" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Users
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <FiUser className="h-5 w-5" />
              </div>
              <span className="hidden md:flex items-center ml-2 text-gray-300">
                {userRole === "owner" ? "Owner" : userRole === "admin" ? "Admin User" : "User"}
                <FiChevronDown className="ml-1 h-4 w-4" />
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                >
                  <FiUser className="mr-2 h-4 w-4" />
                  Your Profile
                </Link>

                {/* Settings only for Admin & Owner */}
                {(userRole === "admin" || userRole === "owner") && (
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  >
                    <FiSettings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            {/* My Emails (Visible to All Users) */}
            <Link
              to="/myemails"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/myemails" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              My Emails
            </Link>

            {(userRole === "admin" || userRole === "owner") && (
              <Link
                to="/emails"
                onClick={toggleMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/emails" ? "text-white bg-purple-700" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                All Emails
              </Link>
            )}

            {/* Settings only for Admin & Owner */}
            {(userRole === "admin" || userRole === "owner") && (
              <Link
                to="/settings"
                onClick={toggleMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Settings
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
