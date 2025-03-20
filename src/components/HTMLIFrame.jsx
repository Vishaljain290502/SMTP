import React from "react";
import DOMPurify from "dompurify";

const RenderHTMLBox = ({ htmlContent }) => {
  return (
    <div className="border p-4 rounded-md shadow-md bg-gray-100">
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
      />
    </div>
  );
};

export default RenderHTMLBox;
