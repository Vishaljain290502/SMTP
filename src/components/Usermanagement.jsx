import React, { useState, useEffect } from "react";
import { FiUserPlus, FiEdit, FiTrash, FiSave, FiX } from "react-icons/fi";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "" });

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERVER_URL}/user/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.data.users.results);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const createUser = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to create user");
      fetchUsers();
      setShowModal(false);
      setNewUser({ username: "", password: "", role: "" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: selectedUser.role, username: selectedUser.username }),
      });
      if (!response.ok) throw new Error("Failed to update user");
      fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <FiUserPlus className="mr-2" /> Create User
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700">Username</th>
              <th className="p-3 border border-gray-700">Role</th>
              <th className="p-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border border-gray-700">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex justify-center space-x-2">
                  <button onClick={() => editUser(user)} className="text-yellow-500 hover:text-yellow-400">
                    <FiEdit />
                  </button>
                  <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-400">
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Create User</h2>
            <label>Username</label>
            <input name="username" value={newUser.username} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleInputChange} />
            <label>Password</label>
            <input name="password" type="password" value={newUser.password} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleInputChange} />
            <label>Role</label>
            <input name="role" value={newUser.role} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleInputChange} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 rounded-md text-white"><FiX /> Cancel</button>
              <button onClick={createUser} className="px-4 py-2 bg-purple-600 rounded-md text-white"><FiSave /> Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <label>Username</label>
            <input name="username" value={selectedUser?.username} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleEditInputChange} />
            <label>Role</label>
            <input name="role" value={selectedUser?.role} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleEditInputChange} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-700 rounded-md text-white"><FiX /> Cancel</button>
              <button onClick={updateUser} className="px-4 py-2 bg-purple-600 rounded-md text-white"><FiSave /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
