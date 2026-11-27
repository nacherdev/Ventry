import { AlumnoBusqueda } from '../services/api';

export function AlumnoItem({ alumno }: { alumno: AlumnoBusqueda }) {
  const verde = alumno.estado === 'VERDE';
  return (
    <li className={`alumno ${verde ? 'verde' : 'rojo'}`}>
      <span className="luz" aria-hidden />
      <div className="info">
        <strong>{alumno.nombreCompleto}</strong>
        <span>{alumno.curso}</span>
      </div>
      <span className="badge">{verde ? 'Mayor de edad' : 'Menor de edad'}</span>
    </li>
  );
}
