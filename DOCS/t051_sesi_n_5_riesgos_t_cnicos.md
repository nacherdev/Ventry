# VENTRY
![Logo VENTRY](image_placeholder)

* **Curso:** 2º DAW
* **Grupo:** Horsitos SL
* **Integrantes:** Nacher, Julian, Jose Javier y David
* **Fecha:** 05-10-2026
* **Tipología:** Desarrollo de Aplicación Web

# Matriz de Riesgos Técnicos, Plan de Contingencia y Prevención (PRL)

## 1. Tabla de Identificación y Evaluación de Riesgos

La siguiente tabla identifica 6 riesgos técnicos que abarcan backend, frontend, base de datos, infraestructura, seguridad y equipo. El Nivel de Riesgo (R) se calcula multiplicando la Probabilidad (P) por el Impacto (I) en una escala del 1 al 5.

| Código | Riesgo Técnico | Categoría | P (1-5) | I (1-5) | Riesgo (R) | Severidad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RT-01** | Corrupción de volúmenes de MySQL locales o pérdida de datos. | Base de Datos | 3 | 4 | 12 | **Moderada/Alta** |
| **RT-02** | Fuga de memoria (Memory Leak) en la aplicación Java del backend. | Backend | 2 | 4 | 8 | **Moderada** |
| **RT-03** | Exposición de credenciales de la BD en el repositorio de GitHub. | Seguridad | 2 | 5 | 10 | **Crítica** |
| **RT-04** | Caída del entorno de despliegue por fallo en contenedores Docker. | Infraestructura | 3 | 3 | 9 | **Moderada** |
| **RT-05** | Errores de renderizado del frontend y scripts JS en la interfaz. | Frontend | 4 | 2 | 8 | **Moderada** |
| **RT-06** | Pérdida de acceso de un desarrollador por avería de hardware local. | Equipo | 2 | 3 | 6 | **Baja** |

## 2. Representación Gráfica: Matriz de Severidad (5x5)

Ubicación de los códigos de riesgo según su Probabilidad e Impacto.

| Impacto \ Probabilidad | 1 (Muy Baja) | 2 (Baja) | 3 (Media) | 4 (Alta) | 5 (Muy Alta) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **5 (Muy Alto)** | | **RT-03** | | | |
| **4 (Alto)** | | **RT-02** | **RT-01** | | |
| **3 (Medio)** | | **RT-06** | **RT-04** | | |
| **2 (Bajo)** | | | | **RT-05** | |
| **1 (Muy Bajo)** | | | | | |

## 3. Fichas del Plan de Contingencia

Desarrollo de los 3 riesgos de mayor severidad.

### Ficha de Contingencia: RT-01
* **Descripción:** Corrupción de la base de datos MySQL local o borrado accidental de volúmenes en Docker durante migraciones.
* **Disparador (Trigger):** Fallo en el arranque del contenedor de la base de datos o pérdida de tablas/datos de prueba.
* **Medidas Preventivas:**
  * Inclusión obligatoria de scripts de semillas en el repositorio Git.
  * Exclusión de los volúmenes de datos locales en `.gitignore`.
* **Plan de Contingencia:**
  1. Ejecutar `docker compose down -v` para eliminar los volúmenes corruptos.
  2. Reconstruir la estructura de la BD ejecutando el script de migración base: `docker compose up -d database`.
  3. Ejecutar el script de repoblado de datos correspondiente para restaurar el estado inicial.
* **Responsable:** Database Admin

### Ficha de Contingencia: RT-02
* **Descripción:** Fuga de memoria en el backend Java que satura los recursos y provoca la caída de la aplicación.
* **Disparador (Trigger):** Monitoreo de RAM del proceso Java superando el 90% de asignación o errores de tipo `OutOfMemoryError` en los logs.
* **Medidas Preventivas:**
  * Uso estricto de estructuras de control eficientes y cierre de conexiones JDBC (DAOs) tras su uso.
  * Configurar límites de memoria en Docker Compose (`mem_limit`).
* **Plan de Contingencia:**
  1. Reiniciar inmediatamente el contenedor del backend para liberar memoria (`docker restart ventry-backend`).
  2. Aislar el endpoint o función específica que causa el pico de consumo analizando los logs recientes.
  3. Implementar un parche temporal deshabilitando la carga masiva de datos en dicho endpoint hasta optimizar la consulta SQL subyacente.
* **Responsable:** Backend Lead

### Ficha de Contingencia: RT-03
* **Descripción:** Subida accidental de contraseñas de producción o credenciales de la base de datos al repositorio público de GitHub.
* **Disparador (Trigger):** Alerta automática de GitHub Secret Scanning o revisión manual que detecta un commit con el archivo `.env` expuesto.
* **Medidas Preventivas:**
  * Uso de variables de entorno estandarizadas y plantilla `.env.example` en el repositorio.
  * Asegurar que `.env` está en la línea 1 del archivo `.gitignore` desde el primer commit.
* **Plan de Contingencia:**
  1. Rotar y revocar inmediatamente las credenciales expuestas en el servidor o base de datos.
  2. Ejecutar `git filter-repo` o BFG Repo-Cleaner para eliminar el archivo del historial completo de Git local.
  3. Realizar un `git push --force` al repositorio para sobrescribir el historial remoto.
* **Responsable:** DevOps / Security Lead

## 4. Protocolo de Ergonomía y PRL del Desarrollador

Este plan establece las normativas de salud para las sesiones prolongadas de programación.

* **Pautas Ergonómicas:** La configuración del espacio físico requiere que el monitor principal esté alineado a la altura de los ojos para evitar tensión cervical. Se debe usar iluminación ambiental adecuada y mantener periféricos en una posición que permita tener los codos en un ángulo de 90 grados.
* **Gestión de la Carga Mental:** Se aplicará la regla 20-20-20: cada 20 minutos de codificación intensiva, apartar la vista a un objeto a 20 pies durante 20 segundos. Para la organización de tareas, se recomiendan ciclos de trabajo basados en la técnica Pomodoro (bloques de 25 minutos y descansos de 5 minutos).
* **Desconexión Digital:** El equipo asume un compromiso expreso de no exigir respuestas a menciones en GitHub, mensajes de coordinación o revisiones de código fuera de las horas acordadas para el desarrollo autónomo.