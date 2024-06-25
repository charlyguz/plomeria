import { useState, useEffect } from 'react';
import {
  BellAlertIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const materialRecomendado = {
  'Mantenimiento preventivo y lavado de tinacos': ['Material A', 'Material B'],
  'Reparación de fuga de agua': ['Material C', 'Material D'],
  'Instalación de calentador de agua': ['Material E', 'Material F']
};

const DashboardTecnico = () => {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [materialesSolicitados, setMaterialesSolicitados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [reparacionEnCurso, setReparacionEnCurso] = useState(null);
  const [evidencia, setEvidencia] = useState(null);
  const [tareasCompletadas, setTareasCompletadas] = useState({
    recogerMateriales: false,
    dirigirseDireccion: false,
    concluirTrabajo: false
  });
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSeleccionarSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setReparacionEnCurso(solicitud);
    setTareasCompletadas({
      recogerMateriales: false,
      dirigirseDireccion: false,
      concluirTrabajo: false
    });
  };

  const handleSolicitarMateriales = async () => {
    const materiales = materialRecomendado[solicitudSeleccionada.TipoServicio] || [];
    setMaterialesSolicitados(materiales);
    setTareasCompletadas((prev) => ({ ...prev, recogerMateriales: true }));
    await actualizarEstadoServicio('Aceptado');
  };

  const handleEvidenciaChange = (event) => {
    setEvidencia(event.target.files[0]);
  };

  const handleConcluirTrabajo = async () => {
    const formData = new FormData();
    formData.append('evidencia', evidencia);
    formData.append('estado', 'Completado');

    try {
      await axios.put(`http://localhost:3002/api/servicios/${reparacionEnCurso.ID_Servicio}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      setTareasCompletadas((prev) => ({ ...prev, concluirTrabajo: true }));
      alert('Trabajo concluido con éxito.');
    } catch (error) {
      console.error('Error concluyendo el trabajo:', error);
    }
  };

  const handleMarcarDireccion = async () => {
    setTareasCompletadas((prev) => ({ ...prev, dirigirseDireccion: true }));
    await actualizarEstadoServicio('En Camino');
  };

  const actualizarEstadoServicio = async (estado) => {
    try {
      await axios.put(`http://localhost:3002/api/servicios/${reparacionEnCurso.ID_Servicio}`, {
        estado
      }, { withCredentials: true });
      setReparacionEnCurso((prev) => ({ ...prev, Estado: estado }));
    } catch (error) {
      console.error('Error actualizando estado del servicio:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3002/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/servicios', {
          withCredentials: true
        });
        setServicios(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const serviciosEnCurso = servicios.filter(s => s.Estado !== 'Completado');
  const serviciosCompletados = servicios.filter(s => s.Estado === 'Completado');

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Panel Técnico</h1>
        <div className="relative">
          <button onClick={() => setUserMenuVisible(!userMenuVisible)}>
            <UserCircleIcon className="h-8 w-8 text-gray-700" />
          </button>
          {userMenuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hover:bg-red-500 py-1 z-40">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:rounded-lg w-full text-left"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sección de solicitudes de reparación en curso */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Solicitudes de Reparación en Curso</h2>
        <ul className="space-y-4">
          {serviciosEnCurso.map((servicio, index) => (
            <li key={index}>
              <button
                className="w-full text-left bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleSeleccionarSolicitud(servicio)}
              >
                Reparación en {servicio.Calle}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de solicitudes de reparación completadas */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Solicitudes de Reparación Completadas</h2>
        <ul className="space-y-4">
          {serviciosCompletados.map((servicio, index) => (
            <li key={index}>
              <button className="w-full text-left bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Reparación en {servicio.Calle} - Completado
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de solicitud de materiales */}
      {solicitudSeleccionada && !tareasCompletadas.recogerMateriales && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Solicitar Materiales</h2>
          <div>
            <label className="block text-gray-700">Materiales Necesarios</label>
            <ul className="list-disc list-inside">
              {materialRecomendado[solicitudSeleccionada.TipoServicio]?.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSolicitarMateriales}
          >
            Tengo los Materiales 
          </button>
        </div>
      )}

      {/* Sección de dirigirse a la dirección */}
      {solicitudSeleccionada && tareasCompletadas.recogerMateriales && !tareasCompletadas.dirigirseDireccion && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Dirigirse a la Dirección</h2>
          <p><strong>Ubicación:</strong> {solicitudSeleccionada.Calle}</p>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleMarcarDireccion}
          >
            Marcar como en Camino
          </button>
        </div>
      )}

      {/* Sección de reparación en curso */}
      {reparacionEnCurso && tareasCompletadas.dirigirseDireccion && !tareasCompletadas.concluirTrabajo && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Reparación en Curso</h2>
          <p><strong>Ubicación:</strong> {reparacionEnCurso.Calle}</p>
          <div className="mt-4">
            <label className="block text-gray-700">Evidencia del Trabajo</label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500"
              onChange={handleEvidenciaChange}
            />
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleConcluirTrabajo}
          >
            Concluir Trabajo
          </button>
        </div>
      )}

      {/* Mensaje de confirmación */}
      {tareasCompletadas.concluirTrabajo && (
        <div className="bg-green-100 shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Trabajo Concluido</h2>
          <p>El trabajo ha sido concluido satisfactoriamente.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardTecnico;
