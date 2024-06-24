const Estadisticas = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Número de Servicios Solicitados y Completados */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Servicios Solicitados y Completados</h3>
          <p>Total Solicitados: 120</p>
          <p>Total Completados: 95</p>
          <p>Pendientes: 25</p>
        </div>
        {/* Tiempo Promedio de Respuesta y Finalización */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Tiempo Promedio</h3>
          <p>Respuesta: 2 horas</p>
          <p>Finalización: 8 horas</p>
        </div>
        {/* Rendimiento de los Técnicos */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Rendimiento de Técnicos</h3>
          <p>Técnico A: 30 servicios</p>
          <p>Técnico B: 25 servicios</p>
          <p>Técnico C: 40 servicios</p>
        </div>
        {/* Utilización de Recursos y Materiales */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Utilización de Materiales</h3>
          <p>Filtros de tinaco: 50</p>
          <p>Tubos de cobre: 100 metros</p>
          <p>Kit de mangueras: 30</p>
        </div>
        {/* Costos y Beneficios */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Costos y Beneficios</h3>
          <p>Costos Totales: $50,000 MXN</p>
          <p>Ingresos Totales: $120,000 MXN</p>
          <p>Beneficio Neto: $70,000 MXN</p>
        </div>
        {/* Tendencias de Servicios */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Tendencias de Servicios</h3>
          <p>Más Solicitados: Reparación de fuga de agua</p>
          <p>Mayor Demanda: Abril - Junio</p>
        </div>
        {/* Calificaciones de Técnicos */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Calificaciones de Técnicos</h3>
          <p>Técnico A: 4.5 estrellas</p>
          <p>Técnico B: 4.0 estrellas</p>
          <p>Técnico C: 4.8 estrellas</p>
        </div>
        {/* Estado de los Trabajos */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Estado de los Trabajos</h3>
          <p>Completados con Éxito: 90</p>
          <p>En Proceso: 20</p>
          <p>Requiere Revisión: 10</p>
        </div>
        {/* Evidencia de Trabajos Completados */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Evidencia de Trabajos</h3>
          <p>Técnico A: 25 evidencias subidas</p>
          <p>Técnico B: 20 evidencias subidas</p>
          <p>Técnico C: 30 evidencias subidas</p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
