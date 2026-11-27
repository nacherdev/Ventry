// DTO: forma pública del alumno en la API. Nunca se serializa la entidad
// completa (qr_token, dni, fecha de nacimiento quedan fuera -> RGPD).
function calcularEdad(fechaNacimiento, hoy = new Date()) {
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - fechaNacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;
  return edad;
}

function toAlumnoBusquedaDTO(alumno) {
  const esMayorEdad = calcularEdad(alumno.fechaNacimiento) >= 18;
  return {
    id: alumno.id,
    nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
    curso: alumno.curso,
    esMayorEdad,
    estado: esMayorEdad ? 'VERDE' : 'ROJO',
  };
}

module.exports = { toAlumnoBusquedaDTO, calcularEdad };
