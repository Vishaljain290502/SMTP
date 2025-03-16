import React, { useState, useEffect } from "react";
import { FiUserPlus, FiEdit, FiTrash, FiSave, FiX } from "react-icons/fi";

const UsersManagement = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "", workerName: "", status: true });

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

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedUser({ ...selectedUser, [name]: type === "checkbox" ? checked : value });
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          role: selectedUser.role, 
          username: selectedUser.username, 
          workerName: selectedUser.workerName,
          status: selectedUser.status
        }),
      });
      if (!response.ok) throw new Error("Failed to update user");

      setUsers(users.map((user) => (user._id === selectedUser._id ? selectedUser : user))); 
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

      setUsers(users.filter((user) => user._id !== id));
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
              <th className="p-3 border border-gray-700">Worker Name</th>
              <th className="p-3 border border-gray-700">Role</th>
              <th className="p-3 border border-gray-700">Status</th>
              <th className="p-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border border-gray-700">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.workerName}</td>
                <td className="p-3">{user.role}</td>
                <td className={`p-3 ${user.status ? "text-green-500" : "text-red-500"}`}>
                  {user.status ? "Active" : "Inactive"}
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <button onClick={() => setSelectedUser(user) || setShowEditModal(true)} className="text-yellow-500 hover:text-yellow-400">
                    <FiEdit />
                  </button>
                  {/* <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-400">
                    <FiTrash />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>

            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input name="username" value={selectedUser.username} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleEditInputChange} />

            <label className="block text-sm text-gray-300 mb-1">Worker Name</label>
            <input name="workerName" value={selectedUser.workerName} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleEditInputChange} />

            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select name="role" value={selectedUser.role} className="w-full p-2 mb-3 bg-gray-900 text-white" onChange={handleEditInputChange}>
              {userRole === "owner" ? (
                <>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </>
              ) : (
                <>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </>
              )}
            </select>

            <label className="block text-sm text-gray-300 mb-1">Status</label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="status" checked={selectedUser.status} onChange={handleEditInputChange} />
              <span>Active</span>
            </label>

            <div className="flex justify-end space-x-2 mt-4">
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
