import React, { useState, useEffect, useRef } from "react";
import { FiFile, FiCalendar } from "react-icons/fi";
import RenderHTMLBox from "./HTMLIFrame";

const EmailPreview = ({ form, setForm, dynamicForm }) => {
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  function replacePlaceholders(template, data) {
    console.log("dynamic form replce inpreviwe  : ", data, "   \n", template);

    const val = template.replace(/{{(.*?)}}/g, (match, key) => {
      return data[key];
    });
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   finalMarkup: val,
    // }));
    return val;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto border border-gray-700">
      <div className="bg-purple-700 p-3 text-white">
        <h2 className="text-lg font-semibold flex items-center justify-center">
          <FiFile className="mr-2" /> Email Preview
        </h2>
      </div>

      <div className="p-4">
        {/* <div className="border border-gray-700 p-4 rounded-md bg-gray-800"> */}
        {/* <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-medium text-gray-100">
              {form.subject || "Subject"}
            </h3>
            <p className="text-sm text-gray-400">
              From: {form.sendingName || "Sender"} &lt;{form.sendingFrom || "email@example.com"}&gt;
            </p>
          </div> */}

        {/* Editable Email Preview */}
        <div className="py-4 text-gray-300 p-3 rounded-md border-gray-600 min-h-[100px]">
          <RenderHTMLBox
            htmlContent={replacePlaceholders(form.markup, dynamicForm)}
          />
        </div>

        {/* <div className="border-t border-gray-700 pt-3 mt-2 flex items-center text-xs text-gray-500">
            <FiCalendar className="mr-1" />
            <span>{todayDate} | REF-V6S2SMCBW5-2025</span>
          </div> */}
      </div>
      {/* </div> */}
    </div>
  );
};

export default EmailPreview;
