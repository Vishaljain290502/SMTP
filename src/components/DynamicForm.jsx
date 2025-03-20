import React, { useEffect, useState } from "react";

function camelToTitle(camelCaseStr) {
  return camelCaseStr
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

const DynamicForm = ({ fields, disp, onChange }) => {
  const [formData, setFormData] = useState({});

  // Initialize state when fields change
  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {});
    setFormData(initialData);
    if (onChange) onChange(initialData);
  }, [fields]);

  // Handle input change and send data to parent
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (onChange) onChange(updatedData); // Send updated values to parent
  };

  return (
    <div className="p-4 rounded-lg w-96 text-white">
      {!disp && (
        <h2 className="text-lg font-semibold mb-2">Detected Dynamic Values</h2>
      )}
      {fields.map((field, index) => (
        <div key={index} className="mb-2">
          <label className="block text-sm font-medium mb-1" htmlFor={field}>
            {!disp && `${index + 1}) `} {camelToTitle(field)}
          </label>
          {disp && (
            <input
              type="text"
              id={field}
              name={field}
              className="w-full p-2 border rounded text-white"
              placeholder={`Enter ${camelToTitle(field)}`}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
