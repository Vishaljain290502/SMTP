import React, { useState, useEffect } from "react";
import { FiUser, FiEdit, FiSave, FiLock, FiBriefcase } from "react-icons/fi";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({ username: "", role: "", workerName: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERVER_URL}/auth/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setUser(data.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user/profile/my`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          workerName: user.workerName,
          password: password || undefined, // Send only if user enters a new password
        }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setIsEditing(false);
      setPassword(""); // Reset password field after update
      fetchUserProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FiUser className="mr-2" /> Profile
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading profile...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-gray-400 text-sm">Username</label>
            <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
              <FiUser className="text-purple-400" />
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="bg-transparent text-white border-b border-gray-500 focus:outline-none w-full"
                />
              ) : (
                <span>{user.username}</span>
              )}
            </div>
          </div>

          {/* Worker Name */}
          <div>
            <label className="text-gray-400 text-sm">Worker Name</label>
            <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
              <FiBriefcase className="text-purple-400" />
              {isEditing ? (
                <input
                  type="text"
                  name="workerName"
                  value={user.workerName}
                  onChange={(e) => setUser({ ...user, workerName: e.target.value })}
                  className="bg-transparent text-white border-b border-gray-500 focus:outline-none w-full"
                />
              ) : (
                <span>{user.workerName || "Not Set"}</span>
              )}
            </div>
          </div>

          {/* Role (Non-Editable) */}
          <div>
            <label className="text-gray-400 text-sm">Role</label>
            <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
              <span className="font-semibold">{user.role}</span>
            </div>
          </div>

          {/* Change Password */}
          {isEditing && (
            <div>
              <label className="text-gray-400 text-sm">New Password</label>
              <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
                <FiLock className="text-purple-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white border-b border-gray-500 focus:outline-none w-full"
                />
              </div>
            </div>
          )}

          {/* Edit/Save Button */}
          <button
            onClick={isEditing ? updateUserProfile : () => setIsEditing(true)}
            className="mt-4 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 flex items-center space-x-2"
          >
            {isEditing ? <FiSave /> : <FiEdit />} <span>{isEditing ? "Save" : "Edit"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
