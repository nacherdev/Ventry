import { useEffect, useState } from 'react';
import { api, HealthResponse } from '../services/api';

type State =
  | { status: 'loading' }
  | { status: 'ok'; data: HealthResponse }
  | { status: 'error'; message: string };

// Custom hook: encapsula la petición y su estado; la vista solo pinta.
export function useHealth(): State {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const ctrl = new AbortController();
    api
      .health(ctrl.signal)
      .then((data) => setState({ status: 'ok', data }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setState({ status: 'error', message: err.message });
      });
    return () => ctrl.abort();
  }, []);

  return state;
}
