'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MapView from '@/components/MapView';

interface Challenge {
  id: number;
  day: number;
  title: string;
  description: string | null;
  type: string;
  completed: boolean;
  geojson: any;
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const day = params.day as string;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/challenges/${day}`)
      .then((res) => {
        if (!res.ok) throw new Error('Challenge not found');
        return res.json();
      })
      .then((data) => {
        setChallenge(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [day]);

  const toggleCompleted = async () => {
    if (!challenge) return;

    try {
      const response = await fetch(`/api/challenges/${day}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !challenge.completed,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setChallenge(updated);
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Challenge Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Day {challenge.day}</p>
            <h1 className="text-3xl font-bold text-gray-800">{challenge.title}</h1>
            {challenge.description && (
              <p className="text-gray-600 mt-2">{challenge.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {challenge.type}
              </span>
              <button
                onClick={toggleCompleted}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  challenge.completed
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {challenge.completed ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {challenge.geojson ? (
          <MapView geojson={challenge.geojson} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Map Data</h2>
              <p className="text-gray-500">
                This challenge doesn't have any geospatial data yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
