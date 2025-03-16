import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TemplateDetails = () => {
  const { id } = useParams(); // Get template ID from URL
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(`${SERVER_URL}/template/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch template");
        const data = await response.json();
        setTemplate(data.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (!template) return <div className="text-white text-center mt-10">Template not found</div>;

  return (
    <div className="p-6 bg-gray-900 text-gray-300 h-screen">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-purple-500 hover:underline mb-4">
        ← Back to Templates
      </button>

      {/* Template Details */}
      <h2 className="text-2xl font-semibold text-white">{template.name}</h2>
      <p className="text-gray-400 mt-2">📧 Email: {template.email}</p>
      <p className="text-gray-400">🏷️ Category: {template.category}</p>
      <p className="text-gray-400 mb-4">📅 Created At: {new Date(template.createdAt).toLocaleString()}</p>

      {/* Template Content */}
      <div className="border border-gray-700 p-4 rounded-md bg-gray-800">
        <h3 className="text-lg font-semibold text-white mb-2">📜 Template Content:</h3>
        <div dangerouslySetInnerHTML={{ __html: template.markup }} className="bg-gray-700 p-4 rounded-md" />
      </div>
    </div>
  );
};

export default TemplateDetails;
