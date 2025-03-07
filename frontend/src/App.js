import { useState } from "react";
import axios from "axios";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

  const handleShorten = async () => {
    if (!longUrl) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, { longUrl });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>
        <input
          type="text"
          placeholder="Enter long URL"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <button
          onClick={handleShorten}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
        {shortUrl && (
          <div className="mt-4 p-3 bg-gray-700 rounded flex justify-between items-center">
            <span className="truncate w-4/5">{shortUrl}</span>
            <button
              onClick={handleCopy}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
