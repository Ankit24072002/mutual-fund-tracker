import React, { useEffect, useState } from "react";
import { API } from "../lib";
import NavChart from "../components/NavChart";

export default function Saved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("mf_token");

  async function fetchSaved() {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();

      if (!res.ok) {
        setError(j.error || "Failed to fetch saved funds");
        setLoading(false);
        return;
      }

      // Fetch details for each saved scheme
      const details = await Promise.all(
        j.savedSchemes.map((code) =>
          fetch(`${API}/api/mf/${code}`).then((r) => r.json())
        )
      );

      setSaved(details);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch saved funds");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSaved();
  }, []);

  async function remove(code) {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API}/api/saved/${code}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();

      if (!res.ok) {
        setError(j.error || "Remove failed");
        return;
      }

      setSaved((prev) =>
        prev.filter(
          (s) => (s.meta?.scheme_code || s.schemeCode) !== code
        )
      );
    } catch (err) {
      console.error(err);
      setError("Remove failed");
    }
  }

  if (!token)
    return (
      <div className="p-4 text-center text-red-500">
        Please login to view your saved funds.
      </div>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Saved Funds</h2>

      {loading && <div className="p-3 text-center">Loading...</div>}
      {error && (
        <div className="p-3 mb-4 text-red-600 bg-red-100 dark:bg-red-900 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {saved.map((s) => {
          const code = s.meta?.scheme_code || s.schemeCode;
          return (
            <div
              key={code}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition hover:shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">{s.meta?.scheme_name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {s.meta?.fund_house}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Code: {code}
                  </div>
                  <button
                    onClick={() => remove(Number(code))}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <NavChart data={s.data} height={150} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
