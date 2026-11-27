import { useHealth } from '../hooks/useHealth';
import { StatusCard } from '../components/StatusCard';

// Componente contenedor: obtiene datos (hook) y delega el pintado.
export function HealthPanel() {
  const health = useHealth();
  const ok = health.status === 'loading' ? null : health.status === 'ok';

  return (
    <section className="panel">
      <h2>Estado del sistema</h2>
      <div className="grid">
        <StatusCard label="Frontend (React SPA)" ok detail="Servido por Nginx :8080" />
        <StatusCard
          label="Backend (Express API)"
          ok={ok}
          detail={
            health.status === 'ok'
              ? `${health.data.status} · ${health.data.latencyMs} ms`
              : health.status === 'error'
                ? health.message
                : 'Consultando /api/v1/health…'
          }
        />
        <StatusCard
          label="Base de datos (PostgreSQL)"
          ok={ok}
          detail={health.status === 'ok' ? health.data.database : '—'}
        />
      </div>
      {health.status === 'ok' && (
        <pre className="json">{JSON.stringify(health.data, null, 2)}</pre>
      )}
    </section>
  );
}
