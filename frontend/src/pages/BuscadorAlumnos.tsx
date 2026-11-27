import { useState } from 'react';
import { useBuscarAlumnos } from '../hooks/useBuscarAlumnos';
import { AlumnoItem } from '../components/AlumnoItem';

export function BuscadorAlumnos() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useBuscarAlumnos(query);

  return (
    <section className="panel">
      <h2>Buscador rápido (RF-05)</h2>
      <input
        className="search"
        type="search"
        placeholder="Nombre, apellidos, DNI o NIA (mín. 2 caracteres)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar alumno"
      />
      {loading && <p className="muted">Buscando…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && query.trim().length >= 2 && results.length === 0 && !error && (
        <p className="muted">Sin coincidencias</p>
      )}
      <ul className="alumnos">
        {results.map((a) => (
          <AlumnoItem key={a.id} alumno={a} />
        ))}
      </ul>
    </section>
  );
}
