import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { FiMail, FiEye } from "react-icons/fi";

const EmailForm = ({ form, setForm, sendEmail, openPreview }) => {
  const [groupedTemplates, setGroupedTemplates] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Fetch Worker Name (Username)
  useEffect(() => {
    const fetchWorkerName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}/auth/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const workerName = response.data?.data?.user?.workerName || "";

        setForm((prevForm) => ({
          ...prevForm,
          workerName, // Auto-fill worker name (but editable)
        }));
      } catch (error) {
        console.error("Error fetching worker name:", error);
      }
    };

    fetchWorkerName();
  }, [setForm]);

  // Fetch Email Templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}/template`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const templates = response.data.data.results;
        groupTemplatesByCategory(templates);
      } catch (error) {
        console.error("Error fetching templates", error);
      }
    };

    fetchTemplates();
  }, []);

  // Group Templates by Category
  const groupTemplatesByCategory = (templates) => {
    const grouped = templates.reduce((acc, template) => {
      const category = template.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];

      acc[category].push({
        label: template.name,
        value: template._id,
        email: template.email,
        markup: template.markup,
        emailName: template.emailName,
      });

      return acc;
    }, {});

    setGroupedTemplates(
      Object.entries(grouped).map(([category, templates]) => ({
        label: category,
        options: templates,
      }))
    );
  };

  // Replace placeholders in the template
  const replacePlaceholders = (templateContent = "", updatedForm) => {
    return templateContent
      .replace(/\{sendingFrom\}/g, updatedForm.sendingFrom || "")
      .replace(/\{workerName\}/g, updatedForm.workerName || "")
      .replace(/\{extra\}/g, updatedForm.extra || "")
      .replace(/\{recipient\}/g, updatedForm.recipient || "");
  };

  // Handle template selection
  const handleTemplateChange = (selectedTemplate) => {
    console.log("selectec",selectedTemplate);
    setForm((prevForm) => ({
      ...prevForm,
      template: selectedTemplate,
      sendingFrom: selectedTemplate.email, 
      sendingName: selectedTemplate.emailName || "", 
      markup: replacePlaceholders(selectedTemplate.markup, prevForm),
    }));
  };
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };
      return { ...updatedForm, markup: replacePlaceholders(prevForm.markup, updatedForm) };
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl mx-auto overflow-hidden border border-gray-700">
      <div className="bg-purple-700 p-3 text-white">
        <h2 className="text-lg font-semibold flex items-center justify-center">
          <FiMail className="mr-2" /> New Message
        </h2>
      </div>

      <div className="p-4">
        <label className="text-xs font-medium text-gray-300">Select Template</label>
        <Select
          options={groupedTemplates}
          onChange={handleTemplateChange}
          placeholder="Choose a Template"
          className="react-select-container mt-1"
          classNamePrefix="react-select"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-300">From Name</label>
            <input
              className="w-full p-1.5 border border-gray-600 rounded-md bg-gray-800 text-white"
              name="sendingName"
              value={form.sendingName}
              onChange={handleInputChange}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-300">From Email</label>
            <input
              className="w-full p-1.5 border border-gray-600 rounded-md bg-gray-800 text-white"
              name="sendingFrom"
              value={form.sendingFrom || ""}
              onChange={handleInputChange}
              placeholder="Enter sender email"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-300">To</label>
          <input
            type="email"
            className="w-full p-1.5 border border-gray-600 rounded-md bg-gray-800 text-white"
            name="recipient"
            value={form.recipient || ""}
            onChange={handleInputChange}
            placeholder="Enter recipient email"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-300">Subject</label>
          <input
            className="w-full p-1.5 border border-gray-600 rounded-md bg-gray-800 text-white"
            name="subject"
            value={form.subject}
            onChange={handleInputChange}
            placeholder="Email subject"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-300">Worker Name</label>
            <input
              className="w-full p-1.5 border border-gray-600 rounded-md bg-gray-800 text-white"
              name="workerName"
              value={form.workerName || ""}
              onChange={handleInputChange} // ✅ Now editable
              placeholder="Worker Name"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
          <button
            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center shadow-sm"
            onClick={() => {
              setForm((prevForm) => ({
                ...prevForm,
                markup: replacePlaceholders(prevForm.template?.markup || "", prevForm),
              }));
            }}
          >
            Refresh Template
          </button>

          <button className="px-3 py-1.5 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800">
            Discard
          </button>

          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 bg-gray-700 text-gray-200 border border-gray-600 rounded-md hover:bg-gray-600 flex items-center"
              onClick={openPreview}
            >
              <FiEye className="mr-1" /> Preview
            </button>
            <button
              className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center shadow-sm"
              onClick={sendEmail}
            >
              <FiMail className="mr-1" /> Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
