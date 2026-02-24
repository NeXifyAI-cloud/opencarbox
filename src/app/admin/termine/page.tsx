'use client';

import { useState, useEffect } from 'react';

interface Termin {
  id: string;
  date: string;
  time: string;
  description?: string;
}

export default function TerminePage() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermine = async () => {
      try {
        // TODO: Fetch from API when backend is ready
        setTermine([
          { id: '1', date: '2026-02-25', time: '09:00', description: 'Werkstatt Termin 1' },
          { id: '2', date: '2026-02-26', time: '14:00', description: 'Werkstatt Termin 2' },
        ]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch termine');
        setLoading(false);
      }
    };

    fetchTermine();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-600">Loading termine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Werkstatt Termine</h1>
      
      {termine.length === 0 ? (
        <p className="text-gray-600">Keine Termine verfügbar.</p>
      ) : (
        <div className="grid gap-4">
          {termine.map((termin) => (
            <div
              key={termin.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{termin.description}</h3>
              <p className="text-sm text-gray-600">
                {termin.date} at {termin.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
