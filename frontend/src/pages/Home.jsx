import React, { useState } from 'react';
import { API } from '../lib';
import FundCard from '../components/FundCard';
import NavChart from '../components/NavChart';

export default function Home() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  async function doSearch(e) {
    e?.preventDefault();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    setMsg(null);

    try {
      const res = await fetch(API + '/api/mf/search?q=' + encodeURIComponent(q));
      const j = await res.json();
      const data = Array.isArray(j) ? j : j.data || [];
      setResults(data);
      if (data.length === 0) setError('No results found');
    } catch (err) {
      console.error(err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(code) {
    setLoading(true);
    setSelected(null);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch(API + '/api/mf/' + code);
      const j = await res.json();
      setSelected(j);
    } catch (err) {
      console.error(err);
      setError('Failed to load details');
    } finally {
      setLoading(false);
    }
  }

  async function saveScheme(code) {
    const token = localStorage.getItem('mf_token');
    if (!token) {
      setMsg('Login required to save funds');
      return;
    }
    try {
      const res = await fetch(API + '/api/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ schemeCode: Number(code) }),
      });
      const j = await res.json();
      if (res.ok) setMsg('Fund saved successfully');
      else setMsg(j.error || 'Save failed');
    } catch (err) {
      console.error(err);
      setMsg('Save failed');
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={doSearch} className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search mutual funds (e.g. HDFC)"
          className="flex-1 p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition duration-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Messages */}
      {error && <div className="p-2 text-red-600 dark:text-red-400">{error}</div>}
      {msg && <div className="p-2 text-green-600 dark:text-green-400">{msg}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Results */}
        <div>
          <h3 className="font-semibold mb-2 text-lg">Results</h3>
          <div className="space-y-2">
            {results.map((r) => (
              <div
                key={r.schemeCode}
                onClick={() => openDetail(r.schemeCode)}
                className={`p-3 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${
                  selected?.meta?.scheme_code === r.schemeCode ||
                  selected?.schemeCode === r.schemeCode
                    ? 'bg-sky-50 dark:bg-gray-700 border-sky-500'
                    : 'bg-white/90 dark:bg-gray-800/90'
                }`}
              >
                <div className="font-semibold text-sky-700 dark:text-sky-400">{r.schemeName}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{r.fundHouse}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Code: {r.schemeCode}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h3 className="font-semibold mb-2 text-lg">Detail</h3>
          {selected ? (
            <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-2xl shadow-xl backdrop-blur-md border border-gray-200 dark:border-gray-700 space-y-4 transition hover:scale-[1.01]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold text-sky-700 dark:text-sky-400">
                    {selected.meta?.scheme_name || selected.schemeName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {selected.meta?.fund_house}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {selected.meta?.scheme_code || selected.schemeCode}
                </div>
              </div>

              <div className="mt-2">
                <NavChart data={selected.data || selected.data} height={180} />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    saveScheme(Number(selected.meta?.scheme_code || selected.schemeCode))
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-md backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300">
              Select a fund to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
