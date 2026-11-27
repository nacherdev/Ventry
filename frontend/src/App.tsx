import { HealthPanel } from './pages/HealthPanel';
import { BuscadorAlumnos } from './pages/BuscadorAlumnos';

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>Ventry</h1>
        <p>Prueba de Concepto · Walking Skeleton (Frontend → Backend → Base de datos)</p>
      </header>
      <HealthPanel />
      <BuscadorAlumnos />
    </main>
  );
}
