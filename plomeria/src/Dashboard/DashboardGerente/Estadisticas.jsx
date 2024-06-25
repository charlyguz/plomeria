import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Estadisticas = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/estadisticas', { withCredentials: true });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to fetch statistics');
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Servicios Solicitados y Completados</h3>
          <p>Total Solicitados: {stats.totalSolicitados}</p>
          <p>Total Completados: {stats.totalCompletados}</p>
          <p>Pendientes: {stats.totalSolicitados - stats.totalCompletados}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Tiempo Promedio</h3>
          <p>Respuesta: {stats.tiempoPromedioRespuesta} horas</p>
          <p>Finalización: {stats.tiempoPromedioFinalizacion} horas</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Rendimiento de Técnicos</h3>
          {stats.rendimientoTecnicos.map((tecnico, index) => (
            <p key={index}>{tecnico.Nombre}: {tecnico.servicios} servicios</p>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Utilización de Materiales</h3>
          {stats.utilizacionMateriales.map((material, index) => (
            <p key={index}>{material.Nombre}: {material.cantidad}</p>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Costos y Beneficios</h3>
          <p>Costos Totales: ${stats.costosYBeneficios.costos} MXN</p>
          <p>Ingresos Totales: ${stats.costosYBeneficios.ingresos} MXN</p>
          <p>Beneficio Neto: ${stats.costosYBeneficios.beneficioNeto} MXN</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Calificaciones de Técnicos</h3>
          {stats.calificacionesTecnicos.map((tecnico, index) => (
            <p key={index}>{tecnico.Nombre}: {tecnico.calificacion} estrellas</p>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Estado de los Trabajos</h3>
          {stats.estadoTrabajos.map((estado, index) => (
            <p key={index}>{estado.Estado}: {estado.cantidad}</p>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Evidencia de Trabajos</h3>
          {stats.evidencias.map((evidencia, index) => (
            <p key={index}>{evidencia.Nombre}: {evidencia.evidencias} evidencias subidas</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
