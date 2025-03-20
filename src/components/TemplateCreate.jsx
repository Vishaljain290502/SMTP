import React, { useState, useEffect, useRef } from "react";
import { FiSave, FiX } from "react-icons/fi";
import DynamicForm from "./DynamicForm";
import RenderHTMLBox from "./HTMLIFrame";
// import EmailEditor from "react-email-editor";
// import { useNavigate } from "react-router-dom";

function extractDynamicFields(htmlString) {
  const regex = /\{([^{}]+)\}/g;
  let matches = [];
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
}

const TemplateAdmin = () => {
  const [activeTab, setActiveTab] = useState("create");
  const emailEditorRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  const [dynamicFeilds, setDynamicFeilds] = useState([]);
  // const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [templateForm, setTemplateForm] = useState({
    name: "",
    emailName: "",
    email: "",
    category: "",
    markup: "",
  });

  // Fetch Templates from API
  useEffect(() => {
    if (activeTab === "list") {
      fetchTemplates();
    }
  }, [activeTab]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`${SERVER_URL}/template`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      // console.log("data",data);
      setTemplates(data.data.results);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const updateStatus = async (templateId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${SERVER_URL}/template/status/${templateId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Update the UI state
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === templateId
            ? { ...template, inactive: !template.inactive }
            : template
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const saveTemplate = async () => {
    const newTemplate = {
      name: templateForm.name,
      emailName: templateForm.emailName,
      email: templateForm.email,
      category: templateForm.category,
      markup: templateForm.markup,
      feilds: dynamicFeilds,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token missing. Please log in.");
        return;
      }

      const response = await fetch(`${SERVER_URL}/template`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      });

      if (!response.ok) throw new Error("Failed to save template");

      alert("Template saved successfully!");
      setActiveTab("list");
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Error saving template.");
    }
  };

  const handleCancel = () => {
    setTemplateForm({
      name: "",
      emailName: "",
      email: "",
      category: "",
      markup: "",
    });
    setActiveTab("list"); // Navigate back to the template list
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-300">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 py-4 px-6">
        <h1 className="text-2xl font-semibold text-white">
          Template Management
        </h1>
      </header>

      {/* Tabs */}
      <div className="bg-gray-800 px-6 border-b border-gray-700">
        <div className="flex space-x-6">
          <button
            className={`py-4 px-2 ${
              activeTab === "list"
                ? "text-purple-500 border-b-2 border-purple-500 font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Template List
          </button>
          <button
            className={`py-4 px-2 ${
              activeTab === "create"
                ? "text-purple-500 border-b-2 border-purple-500 font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Template
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
        {activeTab === "list" ? (
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {templates.map((template) => (
                  <tr key={template._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {template.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {template.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {template.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={template.inactive ? "Inactive" : "Active"}
                        onChange={() =>
                          updateStatus(template._id, template.inactive)
                        }
                        className="bg-gray-800 border border-gray-700 rounded-md text-white px-2 py-1"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Create New Template
            </h2>
            <div className="space-y-6">
              <label className="block text-sm text-gray-400">
                Template Name
              </label>
              <input
                name="name"
                value={templateForm.name}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="Enter template name"
              />

              <label className="block text-sm text-gray-400">From Name</label>
              <input
                name="emailName"
                value={templateForm.emailName}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    emailName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="Enter from name"
              />

              <label className="block text-sm text-gray-400">Email</label>
              <input
                name="email"
                type="email"
                value={templateForm.email}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="Enter email"
              />

              <label className="block text-sm text-gray-400">Category</label>
              <input
                name="category"
                value={templateForm.category}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, category: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="Enter category"
              />

              <label className="block text-sm text-gray-400">
                Email HTML Markup
              </label>
              <textarea
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                name="markup"
                onChange={(e) => {
                  const value = e.target.value;
                  setTemplateForm({ ...templateForm, markup: value });
                  const fields = extractDynamicFields(value);
                  setDynamicFeilds(fields);
                }}
              ></textarea>
              {dynamicFeilds.length > 0 && (
                <RenderHTMLBox htmlContent={templateForm.markup} />
              )}

              {dynamicFeilds.length > 0 && (
                <DynamicForm fields={dynamicFeilds} />
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 flex items-center"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                >
                  <FiSave className="mr-2" /> Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplateAdmin;
