import React, { useState, useEffect, useRef } from "react";
import { FiFile, FiCalendar } from "react-icons/fi";

const EmailPreview = ({ form, setForm }) => {
  const [todayDate, setTodayDate] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    setTodayDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Function to replace placeholders dynamically
  const replacePlaceholders = (content, updatedForm) => {
    if (!content) return "";
    return content
      .replace(/\{sendingFrom\}/g, updatedForm.sendingFrom || "")
      .replace(/\{workerName\}/g, updatedForm.workerName || "")
      .replace(/\{extra\}/g, updatedForm.extra || "")
      .replace(/\{recipient\}/g, updatedForm.recipient || "");
      // .replace(/\{caseId\}/g, updatedForm.caseId || "");
  };

  // Update the preview content when form changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = replacePlaceholders(form.markup || "", form);
    }
  }, [form.markup, form.sendingFrom, form.workerName,  form.extra, form.recipient]);

  // When user edits content, update `form.markup`
  const handleContentEdit = () => {
    if (contentRef.current) {
      setForm((prevForm) => ({
        ...prevForm,
        markup: contentRef.current.innerHTML,
      }));
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl mx-auto border border-gray-700">
      <div className="bg-purple-700 p-3 text-white">
        <h2 className="text-lg font-semibold flex items-center justify-center">
          <FiFile className="mr-2" /> Email Preview
        </h2>
      </div>

      <div className="p-4">
        <div className="border border-gray-700 p-4 rounded-md bg-gray-800">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-medium text-gray-100">
              {form.subject || "Subject"}
            </h3>
            <p className="text-sm text-gray-400">
              From: {form.sendingName || "Sender"} &lt;{form.sendingFrom || "email@example.com"}&gt;
            </p>
          </div>

          {/* Editable Email Preview */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={handleContentEdit}
            className="py-4 text-gray-300 bg-gray-700 p-3 rounded-md border border-gray-600 min-h-[100px]"
          >
            {replacePlaceholders(form.markup || "", form)}
          </div>

          <div className="border-t border-gray-700 pt-3 mt-2 flex items-center text-xs text-gray-500">
            <FiCalendar className="mr-1" />
            <span>{todayDate} | REF-V6S2SMCBW5-2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
