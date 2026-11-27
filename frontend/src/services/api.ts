// Capa de servicios: única puerta de salida HTTP del frontend.
// Aquí se añadirá el interceptor de la cabecera Authorization: Bearer <JWT>.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export interface HealthResponse {
  status: string;
  database: string;
  latencyMs: number;
  timestamp: string;
}

export interface AlumnoBusqueda {
  id: number;
  nombreCompleto: string;
  curso: string;
  esMayorEdad: boolean;
  estado: 'VERDE' | 'ROJO';
}

export interface Paginated<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: (signal?: AbortSignal) => request<HealthResponse>('/health', signal),
  buscarAlumnos: (query: string, signal?: AbortSignal) =>
    request<Paginated<AlumnoBusqueda>>(`/alumnos/buscar?query=${encodeURIComponent(query)}&size=20`, signal),
};
