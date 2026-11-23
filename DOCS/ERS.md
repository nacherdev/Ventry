# Especificación de Requisitos Software (ERS) — VENTRY

**Proyecto:** VENTRY — Control de Acceso y Salida de Alumnado (Mayores de Edad)  
**Empresa / Grupo:** Horsitos SL (2º DAW)  
**Integrantes:** Nacher, Julián, José Javier y David  
**Versión:** 1.0 (Hito 2)  
**Fecha:** 23/11/2026  
**Repositorio:** `https://github.com/nacherdev/Ventry`  

---

## 1. Introducción y Perspectiva del Producto

### 1.1 Propósito del Sistema
El propósito de **VENTRY** es proporcionar al centro educativo una aplicación web responsiva y rápida para la gestión y control de entradas y salidas del alumnado en conserjería. El sistema ingesta los datos oficiales exportados desde **Séneca** y determina de forma automática e inequívoca si un alumno es mayor de edad (**Luz Verde**) o menor de edad (**Luz Roja**), registrando el histórico de salidas, observaciones horarias/laborales y garantizando el cumplimiento estricto de la **LOPD/RGPD** en el tratamiento de datos de menores.

### 1.2 Alcance del Sistema (MVP)
El Producto Mínimo Viable (MVP) cubre:
* Autenticación segura mediante tokens JWT y gestión de sesiones por roles.
* Ingesta, validación y sincronización de datos del alumnado desde ficheros exportados de Séneca.
* Panel de consulta rápida en conserjería por nombre, apellidos, DNI o lectura de código QR/tarjeta, con indicador visual de mayoría de edad (Luz Verde / Luz Roja).
* Visualización diferenciada de datos según edad (protección de datos de menores).
* Registro de movimientos (entradas/salidas), gestión de observaciones/excepciones horarias y modo de respaldo/caché local ante caídas de red.

### 1.3 Perfil de Usuarios y Roles
* **Administrador del Centro (`ROLE_ADMIN`):** Gestiona las cuentas del personal autorizado, realiza la importación/sincronización semanal de datos desde Séneca, audita los registros de salidas y administra las observaciones generales.
* **Personal de Conserjería (`ROLE_CONSERJE`):** Usuario operativo principal en los puntos de acceso. Consulta el estado de mayoría de edad del alumnado mediante buscador o escáner QR, visualiza observaciones autorizadas y registra las entradas y salidas en tiempo real.
* **Equipo Directivo / Jefatura de Estudios (`ROLE_DIRECCION`):** Rol de consulta y supervisión con acceso a informes estadísticos de salidas, incidencias y trazabilidad de accesos.

### 1.4 Restricciones del Entorno Tecnológico
* **Frontend:** React 18+ con TypeScript y Vite, estilizado con Bootstrap 5 / CSS modular adaptado a tablets de conserjería.
* **Backend:** API RESTful desarrollada en Java 17 (LTS) con Spring Boot 3, Spring Security (JWT) y Spring Data JPA.
* **Base de Datos:** MySQL 8.0 con almacenamiento persistente en volúmenes Docker.
* **Infraestructura y Despliegue:** Orquestación mediante Docker y Docker Compose, con proxy inverso Nginx y cifrado TLS/HTTPS en entornos de preproducción y producción.

---

## 2. Especificación de Requisitos Funcionales (RF)

### Módulo 1: Autenticación, Seguridad y Usuarios

#### **RF-01: Inicio de sesión y emisión de token JWT**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** El sistema debe permitir al personal autorizado autenticarse mediante correo institucional y contraseña, devolviendo un token de acceso JWT firmado junto con su rol asignado.
* **Entradas:** `email` (String), `password` (String).
* **Reglas de Negocio:**
  1. Verificar que el usuario existe y su cuenta está activa (`activo = true`).
  2. Validar el hash de la contraseña mediante BCrypt. Si las credenciales son incorrectas, devolver HTTP `401 Unauthorized` sin revelar qué campo falló.
  3. Generar un token JWT con expiración de 60 minutos que incluya el identificador del usuario y su rol.
* **Salidas:** Respuesta HTTP `200 OK` con objeto JSON (`accessToken`, `tokenType: "Bearer"`, `expiresIn`, `userRole`).

#### **RF-02: Gestión de usuarios y control de acceso por roles (RBAC)**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** El administrador del sistema debe poder crear, listar, modificar y desactivar cuentas del personal de conserjería y dirección, restringiendo los endpoints según el rol.
* **Entradas:** `nombre`, `apellidos`, `email`, `password`, `rol` (`ROLE_ADMIN`, `ROLE_CONSERJE`, `ROLE_DIRECCION`).
* **Reglas de Negocio:**
  1. Solo un usuario con `ROLE_ADMIN` puede invocar los endpoints `/api/admin/users/**`.
  2. No se permite duplicar correos electrónicos en el sistema (HTTP `409 Conflict`).
  3. Un administrador no puede desactivar su propia cuenta activa.
* **Salidas:** Estado HTTP `201 Created` o `200 OK` con la ficha del usuario (omitiendo el campo contraseña).

---

### Módulo 2: Ingesta y Sincronización de Datos (Séneca)

#### **RF-03: Importación y procesamiento ETL de datos de Séneca**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** El administrador debe poder subir un archivo exportado desde Séneca (CSV/XML) para cargar o actualizar masivamente el censo del alumnado del curso académico.
* **Entradas:** Archivo fichero (`multipart/form-data`), `curso_academico`.
* **Reglas de Negocio:**
  1. Validar la estructura de cabeceras y tipos de datos antes de iniciar la transacción; si el formato es inválido, rechazar con HTTP `400 Bad Request` detallando las líneas erróneas.
  2. Calcular automáticamente el atributo `esMayorEdad` comparando `fechaNacimiento` con la fecha actual del sistema (`edad >= 18`).
  3. Realizar operación *upsert* usando el `DNI/NIE` o `NIA` como clave única para evitar duplicados y actualizar cambios de grupo o fotografía.
* **Salidas:** Resumen de importación HTTP `200 OK` (`totalProcesados`, `insertados`, `actualizados`, `errores`).

#### **RF-04: Validación y cuarentena de registros incompletos en la ingesta**
* **Prioridad MoSCoW:** Should Have (S)
* **Descripción:** Si durante la importación un registro carece de fecha de nacimiento o identificador válido, el sistema debe aislarlo sin detener la carga del resto del fichero.
* **Entradas:** Fila de datos del fichero de importación.
* **Reglas de Negocio:**
  1. Ningún alumno sin `fechaNacimiento` válida puede ser marcado por defecto como mayor de edad (`esMayorEdad = false` por seguridad).
  2. Registrar la incidencia en un log de auditoría visible para el administrador.
* **Salidas:** Listado de advertencias adjunto al informe de importación.

---

### Módulo 3: Panel de Conserjería y Validación de Edad

#### **RF-05: Búsqueda rápida de alumnado por DNI, NIA o nombre**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** El personal de conserjería debe poder buscar alumnos en tiempo real escribiendo parcialmente su nombre, apellidos o documento identificativo.
* **Entradas:** Parámetro de consulta `query` (mínimo 2 caracteres), `page`, `size`.
* **Reglas de Negocio:**
  1. La búsqueda debe ser insensible a mayúsculas y tildes.
  2. Si `query` tiene menos de 2 caracteres, devolver HTTP `400 Bad Request`.
  3. Limitar los resultados a un máximo de 20 coincidencias por petición para mantener la agilidad en tablet.
* **Salidas:** Lista paginada HTTP `200 OK` con coincidencias básicas (`id`, `nombreCompleto`, `curso`, `esMayorEdad`).

#### **RF-06: Indicador visual de mayoría de edad (Luz Verde / Luz Roja) y privacidad**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** Al seleccionar un alumno, la interfaz debe mostrar un indicador visual de alto contraste (**Luz Verde** si `edad >= 18`, **Luz Roja** si `edad < 18`) y filtrar los datos mostrados según su condición legal.
* **Entradas:** `alumnoId` o código leído.
* **Reglas de Negocio:**
  1. **Si es Mayor de Edad (Luz Verde):** Mostrar fotografía del alumno, nombre completo, curso, grupo, edad y observaciones autorizadas (ej. convalidaciones, contrato laboral).
  2. **Si es Menor de Edad (Luz Roja):** Ocultar fotografía y observaciones sensibles en la vista rápida; mostrar exclusivamente nombre, apellidos, curso y aviso de restricción de salida sin autorización paterna/tutorial.
* **Salidas:** Objeto DTO `FichaAccesoAlumnoDTO` adaptado al perfil de privacidad y estado visual (`VERDE` / `ROJO`).

#### **RF-07: Lectura y validación mediante código QR o tarjeta identificativa**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** El sistema debe permitir escanear un código QR o tarjeta del alumno mediante lector óptico/cámara para abrir instantáneamente su ficha de control de acceso.
* **Entradas:** `codigoQr` (String tokenizado).
* **Reglas de Negocio:**
  1. Validar que el código QR pertenece a un alumno matriculado en el curso vigente.
  2. Si el código no existe o corresponde a un alumno dado de baja, mostrar alerta sonora/visual y devolver HTTP `404 Not Found`.
* **Salidas:** Ficha de validación inmediata del alumno (HTTP `200 OK`).

#### **RF-08: Generación e impresión de carnets digitales con código QR**
* **Prioridad MoSCoW:** Could Have (C)
* **Descripción:** El administrador puede generar un documento descargable con el carnet digital y código QR único para los alumnos mayores de edad que lo soliciten.
* **Entradas:** `alumnoId` o lista de `alumnoIds`.
* **Reglas de Negocio:**
  1. El código QR debe contener un identificador opaco (UUID) y no datos personales en texto plano.
  2. Solo disponible para alumnos activos en el sistema.
* **Salidas:** Archivo PDF o imagen PNG descargable con el QR generado.

---

### Módulo 4: Ficha de Alumno, Histórico y Continuidad Operativa

#### **RF-09: Registro e histórico de entradas y salidas del alumnado**
* **Prioridad MoSCoW:** Must Have (M)
* **Descripción:** Cada vez que conserjería valide un movimiento, el sistema debe registrar la fecha, hora exacta, tipo de movimiento (`ENTRADA` / `SALIDA`), estado de autorización y conserje responsable.
* **Entradas:** `alumnoId`, `tipoMovimiento`, `observacionPuntual` (opcional).
* **Reglas de Negocio:**
  1. Un movimiento de salida de un menor de edad sin autorización previa registrada queda bloqueado por defecto salvo confirmación explícita con motivo justificado (`autorizacionExcepcional = true`).
  2. Los registros del histórico son inmutables (no se pueden borrar ni editar manualmente por conserjería para garantizar trazabilidad).
* **Salidas:** Registro creado HTTP `201 Created` con marca temporal ISO-8601.

#### **RF-10: Gestión de observaciones y excepciones horarias**
* **Prioridad MoSCoW:** Should Have (S)
* **Descripción:** El equipo directivo o administrador puede añadir observaciones permanentes o temporales a la ficha de un alumno mayor de edad (ej. "Sale a las 13:30 por contrato de trabajo" o "Convalida primera hora").
* **Entradas:** `alumnoId`, `textoObservacion`, `fechaInicio`, `fechaFin` (opcional).
* **Reglas de Negocio:**
  1. Solo usuarios con `ROLE_ADMIN` o `ROLE_DIRECCION` pueden crear o modificar observaciones.
  2. Las observaciones caducadas (`fechaFin < fechaActual`) dejan de mostrarse en el panel de conserjería automáticamente.
* **Salidas:** Observación vinculada a la ficha del alumno (HTTP `200 OK`).

#### **RF-11: Modo desconectado y caché local en conserjería**
* **Prioridad MoSCoW:** Should Have (S)
* **Descripción:** Ante una caída puntual de la red local del centro, la aplicación React debe mantener una caché cifrada en el navegador con el listado básico de alumnos del día y encolar los registros de salida para sincronizarlos al recuperar la conexión.
* **Entradas:** Eventos de estado de red (`online` / `offline`) y movimientos registrados sin conexión.
* **Reglas de Negocio:**
  1. Mostrar un indicador visual claro de "Modo Sin Conexión" en la barra superior de conserjería.
  2. Al restablecerse la conexión con la API, enviar automáticamente la cola pendiente manteniendo la marca temporal original en que ocurrió cada salida.
* **Salidas:** Sincronización en lote HTTP `200 OK` y vaciado de la cola local.

---

## 3. Especificación de Requisitos No Funcionales (RNF)

| ID | Categoría | Descripción del Requisito | Métrica Objetiva y Verificable |
| :--- | :--- | :--- | :--- |
| **RNF-01** | **Rendimiento** | La búsqueda rápida de alumnos y la validación por código QR en conserjería deben responder de forma casi instantánea para evitar colas en los cambios de clase. | El **95% de las peticiones** `GET /api/alumnos/buscar` y `GET /api/alumnos/qr/{codigo}` deben responder en **< 200 ms** con una base de datos de hasta 2.500 alumnos y 20 peticiones concurrentes. |
| **RNF-02** | **Seguridad** | Todas las comunicaciones deben viajar cifradas y el acceso a la API REST debe protegerse mediante autenticación JWT y hash robusto de contraseñas. | Contraseñas almacenadas con **BCrypt (factor de coste ≥ 10)**; tokens JWT firmados con expiración máxima de **60 min**; tráfico bajo **HTTPS (TLS 1.2/1.3)** y rechazo **HTTP 401/403** en el 100% de peticiones no autorizadas. |
| **RNF-03** | **Cumplimiento RGPD / LOPD** | El sistema debe aplicar minimización de datos para menores de edad y registrar auditoría de accesos e importaciones conforme al RGPD. | **0 datos sensibles o fotografías** de menores expuestos en el endpoint de consulta de conserjería; **100% de acciones críticas** (importaciones y salidas excepcionales) registradas con `usuario_id` y `timestamp` inmutable. |
| **RNF-04** | **Usabilidad y Accesibilidad** | La interfaz web en React debe ser plenamente operable desde tablets táctiles en conserjería y ofrecer alto contraste en los indicadores Luz Verde / Luz Roja. | Cumplimiento del estándar **WCAG 2.1 Nivel AA** (ratio de contraste mínimo **4.5:1** en textos y estados), botones táctiles de tamaño **≥ 44x44 px** y puntuación **≥ 90** en auditoría Lighthouse Accessibility. |
| **RNF-05** | **Despliegue e Infraestructura** | Toda la arquitectura (Frontend React/Vite, Backend Spring Boot y Base de Datos MySQL) debe estar contenerizada y reproducible mediante Docker Compose. | Despliegue íntegro y operativo en un entorno limpio ejecutando únicamente `docker compose up -d --build` en un tiempo total **< 3 minutos**, con persistencia de datos verificada tras `docker compose restart`. |
| **RNF-06** | **Disponibilidad y Recuperación** | El sistema debe garantizar continuidad operativa durante toda la jornada lectiva y permitir la restauración rápida ante corrupción de datos. | Disponibilidad **≥ 99.5%** en horario lectivo (08:00 a 22:00 h) y tiempo máximo de recuperación ante fallo (**RTO < 10 minutos**) mediante volúmenes Docker y scripts de respaldo/semilla. |

---

## 4. Priorización y Matriz de Trazabilidad (ERS ↔ Backlog)

Para garantizar la coherencia total con el Product Backlog planificado en las Sesiones 3 y 6 (orientado a las 4 Épicas de VENTRY en GitHub Projects), cada Requisito Funcional se vincula con su Historia de Usuario correspondiente:

| ID Req. | Título del Requisito | Prioridad MoSCoW | Historia de Usuario (Backlog) | Épica / Módulo Técnico | Caso de Prueba (QA) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **RF-01** | Inicio de sesión y emisión de token JWT | **Must (M)** | **HU-02:** Autenticación y Control de Acceso para Conserjería | Épica 1 / Auth & Security | `TC-AUTH-01` |
| **RF-02** | Gestión de usuarios y control por roles | **Must (M)** | **HU-02:** Autenticación y Control de Acceso para Conserjería | Épica 1 / Admin & RBAC | `TC-AUTH-02` |
| **RF-03** | Importación y procesamiento ETL de Séneca | **Must (M)** | **HU-01:** Sincronización e Importación de Alumnos desde Séneca | Épica 1 / Ingesta ETL | `TC-ING-01` |
| **RF-04** | Validación y cuarentena de registros incompletos | **Should (S)** | **HU-01:** Sincronización e Importación de Alumnos desde Séneca | Épica 1 / Ingesta ETL | `TC-ING-02` |
| **RF-05** | Búsqueda rápida de alumnado por DNI/nombre | **Must (M)** | **HU-05:** Buscador Rápido de Alumnos por Nombre o DNI | Épica 2 / Panel Conserjería | `TC-PAN-01` |
| **RF-06** | Indicador visual Luz Verde / Luz Roja y privacidad | **Must (M)** | **HU-04:** Indicador Visual de Mayoría de Edad (Luz Verde / Roja) | Épica 2 / Panel & LOPD | `TC-PAN-02` |
| **RF-07** | Lectura y validación mediante código QR | **Must (M)** | **HU-08:** Integración de Escáner de Código QR o Tarjeta | Épica 2 / Panel & Escáner | `TC-PAN-03` |
| **RF-08** | Generación e impresión de carnets con QR | **Could (C)** | **HU-09:** Generación e Impresión del Carnet Digital QR | Épica 3 / Ficha Alumno | `TC-FIC-01` |
| **RF-09** | Registro e histórico de entradas y salidas | **Must (M)** | **HU-11:** Registro e Histórico de Salidas de Alumnos | Épica 3 / Ficha Alumno | `TC-FIC-02` |
| **RF-10** | Gestión de observaciones y excepciones horarias | **Should (S)** | **HU-06:** Módulo de Observaciones y Excepciones Horarias | Épica 3 / Ficha Alumno | `TC-FIC-03` |
| **RF-11** | Modo desconectado y caché local en conserjería | **Should (S)** | **HU-10:** Modo Desconectado / Caché Local en Conserjería | Épica 4 / Infraestructura | `TC-INF-01` |