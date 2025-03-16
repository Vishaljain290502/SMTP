import React, { useEffect, useState } from "react";

const MyEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchEmails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SERVER_URL}/email/my`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.statusCode === 200) {
          setEmails(data.data.results);
        } else {
          setError(data.message || "Failed to fetch emails");
        }
      } catch (err) {
        setError("Error fetching emails.");
      }
      setLoading(false);
    };

    fetchEmails();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-gray-900 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">My Emails</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {emails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-white">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="border border-gray-700 p-3 text-left">Subject</th>
                <th className="border border-gray-700 p-3 text-left">To</th>
                <th className="border border-gray-700 p-3 text-left">From</th>
                <th className="border border-gray-700 p-3 text-left">Date Sent</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email._id} className="hover:bg-gray-700">
                  <td className="border border-gray-700 p-3">{email.subject}</td>
                  <td className="border border-gray-700 p-3">{email.to}</td>
                  <td className="border border-gray-700 p-3">{email.from}</td>
                  <td className="border border-gray-700 p-3">
                    {new Date(email.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-gray-400">No emails found.</p>
      )}
    </div>
  );
};

export default MyEmails;
