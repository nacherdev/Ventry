import { useEffect, useState } from 'react';
import { api, AlumnoBusqueda } from '../services/api';
import { useDebounce } from './useDebounce';

export function useBuscarAlumnos(query: string) {
  const debounced = useDebounce(query.trim(), 300);
  const [results, setResults] = useState<AlumnoBusqueda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    api
      .buscarAlumnos(debounced, ctrl.signal)
      .then((res) => {
        setResults(res.data);
        setError(null);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [debounced]);

  return { results, loading, error };
}
