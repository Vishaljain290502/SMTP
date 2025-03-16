import React, { useState, useEffect } from "react";
import EmailForm from "./Emailform";
import EmailPreview from "./EmailPreview";
import axios from "axios";

const EmailSender = () => {
  const [form, setForm] = useState({
    sendingName: "Crypto.com: Fraud/Asset Loss",
    sendingFrom: "hello@crypto.com",
    recipient: "",
    subject: "Your case is under review",
    workerName: "",
    caseId: "X8TL58",
    extra: "Authentication Code: 475-3",
    template: null,
    markup: "",
  });

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [showPreview, setShowPreview] = useState(false);

  // Function to replace placeholders dynamically
  const replacePlaceholders = (templateContent = "", formData) => {
    return templateContent
      .replace(/\{sendingFrom\}/g, formData.sendingFrom || "")
      .replace(/\{workerName\}/g, formData.workerName || "")
      .replace(/\{extra\}/g, formData.extra || "")
      .replace(/\{recipient\}/g, formData.recipient || "");
  };

  // Fetch template details when the user selects a template
  const handleTemplateChange = async (selectedTemplate) => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/template/${selectedTemplate.value}`);

      setForm((prevForm) => {
        const updatedMarkup = replacePlaceholders(data.markup || "", prevForm);

        return {
          ...prevForm,
          template: selectedTemplate,
          sendingFrom: data.email || prevForm.sendingFrom,
          markup: updatedMarkup,
        };
      });
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };

  // Handle input changes and dynamically update the template
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };

      return {
        ...updatedForm,
        markup: replacePlaceholders(prevForm.markup, updatedForm), // caseId update nahi hoga
      };
    });
  };

  const sendEmail = async () => {
    if (!form.recipient) {
      alert("Please enter a recipient email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: No token found. Please log in.");
        return;
      }

      // Create Email Data for API & Database
      const emailData = {
        to: form.recipient.trim(),
        subject: form.subject,
        html: form.markup, // HTML Content
        text: form.markup.replace(/<[^>]*>/g, ""), // Convert HTML to Plain Text
        from: form.sendingFrom, // Sender Email
        workerName: form.workerName, // Worker Name
        caseId: form.caseId || "", // Case ID (optional)
        template: form.template?.value || null, // Template ID
      };

      // ✅ 1. Send Email via API
      const response = await axios.post(`${SERVER_URL}/email`, emailData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Email Sent Successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
      <div className="w-full max-w-6xl">
        {/* Title */}
        <h2 className="text-white text-2xl font-bold text-center mb-4">Send an Email</h2>

        {/* Responsive Grid */}
        <div
          className={`grid w-full gap-6 ${
            showPreview ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Email Form */}
          <EmailForm
            form={form}
            handleChange={handleChange}
            setForm={setForm}
            sendEmail={sendEmail}
            openPreview={() => setShowPreview(!showPreview)}
            onTemplateSelect={handleTemplateChange}
          />

          {/* Email Preview (Shown Only When Toggled) */}
          {showPreview && (
            <div className="w-full">
              <EmailPreview form={form} setForm={setForm} />
            </div>
          )}
        </div>

        {/* Toggle Preview Button
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default EmailSender;
