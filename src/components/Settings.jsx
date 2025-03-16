import React, { useState, useEffect } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Fetch from .env

const SettingsPage = () => {
  const [workerName, setWorkerName] = useState("");
  const [settings, setSettings] = useState({
    smtpIp: "",
    telegramBotToken: "",
    telegramChatId: "",
    workerName: "",
  });

  const [isWorkerNameModalOpen, setWorkerNameModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${SERVER_URL}/settings/global`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();
        if (data.statusCode === 200) {
          setSettings({
            smtpIp: data.data.smtpip,
            telegramBotToken: data.data.telegramBotId,
            telegramChatId: data.data.telegramChatId,
            workerName: data.data.workerName,
          });
        } else {
          setError("Failed to fetch settings.");
        }
      } catch (err) {
        setError(err.message || "Error fetching settings.");
      }

      setLoading(false);
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/settings/global`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          smtpip: settings.smtpIp,
          telegramBotId: settings.telegramBotToken,
          telegramChatId: settings.telegramChatId,
          workerName: settings.workerName,
        }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
        alert("Settings updated successfully!");
      } else {
        setError("Failed to update settings.");
      }
    } catch (err) {
      setError("Error updating settings. Please try again.");
    }

    setLoading(false);
  };

  // Change worker name
  const handleWorkerNameSubmit = (e) => {
    e.preventDefault();
    setWorkerNameModalOpen(false);
    setSettings((prev) => ({ ...prev, workerName }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      {loading && <p className="text-yellow-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSettingsSubmit} className="space-y-4">
        {/* Worker Name Change Button */}
        <button
          onClick={() => setWorkerNameModalOpen(true)}
          className="w-full p-2 mb-4 bg-green-600 rounded-md hover:bg-green-700"
        >
          Change Worker Name
        </button>
        <div>
          <label className="block text-sm">SMTP IP</label>
          <input
            type="text"
            name="smtpIp"
            value={settings.smtpIp}
            onChange={handleSettingsChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm">Telegram Bot Token</label>
          <input
            type="text"
            name="telegramBotToken"
            value={settings.telegramBotToken}
            onChange={handleSettingsChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm">Telegram Chat ID</label>
          <input
            type="text"
            name="telegramChatId"
            value={settings.telegramChatId}
            onChange={handleSettingsChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Worker Name Change Modal */}
      {isWorkerNameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Change Worker Name</h3>
            <form onSubmit={handleWorkerNameSubmit} className="space-y-4">
              <input
                type="text"
                name="workerName"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                placeholder="New Worker Name"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setWorkerNameModalOpen(false)}
                  className="p-2 bg-gray-600 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-green-600 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
