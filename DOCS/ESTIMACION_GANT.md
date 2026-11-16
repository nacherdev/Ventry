gantt
    title Planificación Fase de Desarrollo - Proyecto Ventry
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m
    
    section Diseño
    Plan de Trabajo y ERS           :done, t1, 2026-11-09, 2026-11-13
    Gantt y Story Points            :done, t2, after t1, 3d
    Hito 2 - Plan de Trabajo        :milestone, m1, 2026-11-16, 0d
    
    section Arquitectura y Datos
    Modelado de Base de Datos       :active, t3, 2026-11-17, 10d
    Especificación OpenAPI          :active, t4, after t3, 5d
    
    section Desarrollo Backend
    Implementación CRUD Usuarios    :t5, after t4, 10d
    API de Registros E/S            :t6, after t5, 8d
    
    section Desarrollo Frontend
    Prototipado UI y Vistas Base    :t7, 2026-11-20, 10d
    Integración Consumo API         :t8, after t6, 10d
    Hito 3 - Diseño Integral        :milestone, m2, 2026-12-14, 0d
    
    section Pruebas y Despliegue
    Pruebas Integración E2E         :t9, after t8, 7d
    Despliegue Contenedor Docker    :t10, after t9, 5d
    Demo Funcional de FCT           :milestone, m3, 2027-01-15, 0d
    Hito 4 Final - Entrega          :milestone, m4, 2027-01-18, 0d
    Inicio de FCT (Prácticas)       :milestone, m5, 2027-01-22, 0d
