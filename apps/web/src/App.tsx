import { useEffect, useState } from 'react';
import { getHealth } from './services/api';

type HealthResponse = {
  status: string;
  service: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then((data: HealthResponse) => {
        setHealth(data);
      })
      .catch(() => {
        setError('Unable to connect to API');
      });
  }, []);

  return (
    <main>
      <h1>Collaboration Engine</h1>

      {health && (
        <section>
          <h2>API Status</h2>
          <p>Status: {health.status}</p>
          <p>Service: {health.service}</p>
        </section>
      )}

      {error && <p>{error}</p>}
    </main>
  );
}

export default App;