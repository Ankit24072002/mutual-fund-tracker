import React, { useState } from 'react';
import { API } from '../lib';
import NavChart from '../components/NavChart';

export default function Compare() {
  const [codes, setCodes] = useState(['', '']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSchemeInput = () => setCodes([...codes, '']);
  const removeSchemeInput = index => setCodes(codes.filter((_, i) => i !== index));

  const updateCode = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
  };

  async function doCompare(e) {
    e?.preventDefault();
    const sc = codes.filter(Boolean).map(Number);
    if (sc.length < 2) {
      alert('Enter at least 2 scheme codes');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API + '/api/mf/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeCodes: sc }),
      });
      const j = await res.json();
      setResults(j);
    } catch (err) {
      console.error(err);
      alert('Compare failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Compare Funds</h2>

      <form onSubmit={doCompare} className="space-y-3 mb-6">
        {codes.map((code, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={code}
              onChange={e => updateCode(i, e.target.value)}
              className="flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder={`Scheme code ${i + 1}`}
            />
            {codes.length > 2 && (
              <button
                type="button"
                onClick={() => removeSchemeInput(i)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addSchemeInput}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            + Add Scheme
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(r => (
            <div
              key={r.meta?.scheme_code}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="font-semibold text-sky-700 dark:text-sky-400">
                {r.meta?.scheme_name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{r.meta?.fund_house}</div>
              <div className="mt-3">
                <NavChart data={r.data} height={180} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
