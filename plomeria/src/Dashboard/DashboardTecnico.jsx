import { useState, useEffect } from 'react';
import { BellAlertIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const materialRecomendado = {
  'Mantenimiento preventivo y lavado de tinacos': [
    '1 Filtro de tinaco',
    '1 litro de solución sanitizante antibacterial',
    '1 Cepillo con extensor'
  ],
  'Reparación de fuga de agua': [
    '3 metros de Tubo de cobre de 1/2 pulgada',
    '5 Codos de 1/2 pulgada',
    '2 Metros de soldadura',
    '1 tubo de gas butano de 1/2 litro'
  ],
  'Instalación de calentador de agua': [
    '1 Kit de mangueras de agua caliente, fria y gas',
    '1 rollo de cinta Teflón',
    '2 Valvulas de presión inversa de 1/2 pulgada'
  ]
};

const materialIds = {
  'Filtro de tinaco': 11,
  'Solución sanitizante antibacterial': 12,
  'Cepillo con extensor': 13,
  'Tubo de cobre de 1/2 pulgada': 14,
  'Codos de 1/2 pulgada': 15,
  'Soldadura': 16,
  'Tubo de gas butano de 1/2 litro': 17,
  'Kit de mangueras de agua caliente, fria y gas': 18,
  'Rollo de cinta Teflón': 19,
  'Válvulas de presión inversa de 1/2 pulgada': 20
};

const materialCantidades = {
  'Filtro de tinaco': 1,
  'Solución sanitizante antibacterial': 1,
  'Cepillo con extensor': 1,
  'Tubo de cobre de 1/2 pulgada': 3,
  'Codos de 1/2 pulgada': 5,
  'Soldadura': 2,
  'Tubo de gas butano de 1/2 litro': 1,
  'Kit de mangueras de agua caliente, fria y gas': 1,
  'Rollo de cinta Teflón': 1,
  'Válvulas de presión inversa de 1/2 pulgada': 2
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

  const handleSeleccionarSolicitud = async (solicitud) => {
    if (reparacionEnCurso && reparacionEnCurso.ID_Servicio === solicitud.ID_Servicio) {
      return; // Si ya está en curso la misma solicitud, no hacer nada
    }
    try {
      const response = await axios.get(`http://localhost:3002/api/servicios/${solicitud.ID_Servicio}/progreso`, { withCredentials: true });
      const progreso = response.data;

      setSolicitudSeleccionada(solicitud);
      setReparacionEnCurso(solicitud);
      setTareasCompletadas({
        recogerMateriales: progreso.recogerMateriales === 1,
        dirigirseDireccion: progreso.dirigirseDireccion === 1,
        concluirTrabajo: progreso.concluirTrabajo === 1
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleSolicitarMateriales = async () => {
    if (!tareasCompletadas.recogerMateriales) {
      const materiales = materialRecomendado[solicitudSeleccionada.TipoServicio] || [];
      
      // Mapear los nombres de los materiales a los IDs y cantidades
      const materialesParaEnviar = materiales.map((material) => {
        const materialId = materialIds[material]; // Función para obtener el ID del material por su nombre
        const cantidad = materialCantidades[material]; // Función para obtener la cantidad utilizada del material
        return { ID_Material: materialId, CantidadUtilizada: cantidad };
      });
  
      setMaterialesSolicitados(materiales);
      setTareasCompletadas((prev) => ({ ...prev, recogerMateriales: true }));
      await actualizarProgresoServicio(reparacionEnCurso.ID_Servicio, { recogerMateriales: true });
      await actualizarEstadoServicio(reparacionEnCurso.ID_Servicio, 'Aceptado');
      
      // Enviar materiales al servidor
      await axios.post(`http://localhost:3002/api/servicios/${reparacionEnCurso.ID_Servicio}/materiales`, { materiales: materialesParaEnviar }, { withCredentials: true });
  
      fetchServices();  // Refresca los servicios después de actualizar el estado
    }
  };

  const handleEvidenciaChange = (event) => {
    setEvidencia(event.target.files[0]);
  };

  const handleConcluirTrabajo = async () => {
    const formData = new FormData();
    formData.append('evidencia', evidencia);
    formData.append('estado', 'Esperando Calificación');
  
    try {
      await axios.put(`http://localhost:3002/api/servicios/${reparacionEnCurso.ID_Servicio}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      setTareasCompletadas((prev) => ({ ...prev, concluirTrabajo: true }));
      await actualizarProgresoServicio(reparacionEnCurso.ID_Servicio, { concluirTrabajo: true });
      await actualizarEstadoServicio(reparacionEnCurso.ID_Servicio, 'Esperando Calificación');
      alert('Trabajo concluido con éxito. Esperando calificación del cliente.');
      fetchServices();  // Refresca los servicios después de actualizar el estado
    } catch (error) {
      console.error('Error concluyendo el trabajo:', error);
    }
  };

  const handleMarcarDireccion = async () => {
    if (!tareasCompletadas.dirigirseDireccion) {
      setTareasCompletadas((prev) => ({ ...prev, dirigirseDireccion: true }));
      await actualizarProgresoServicio(reparacionEnCurso.ID_Servicio, { dirigirseDireccion: true });
      await actualizarEstadoServicio(reparacionEnCurso.ID_Servicio, 'En Camino');
      fetchServices();  // Refresca los servicios después de actualizar el estado
    }
  };

  const actualizarEstadoServicio = async (idServicio, estado) => {
    try {
      await axios.put(`http://localhost:3002/api/servicios/${idServicio}`, {
        estado
      }, { withCredentials: true });
      setReparacionEnCurso((prev) => ({ ...prev, Estado: estado }));
    } catch (error) {
      console.error('Error actualizando estado del servicio:', error);
    }
  };

  const actualizarProgresoServicio = async (idServicio, progreso) => {
    try {
      await axios.put(`http://localhost:3002/api/servicios/${idServicio}/progreso`, progreso, { withCredentials: true });
    } catch (error) {
      console.error('Error actualizando progreso del servicio:', error);
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

  useEffect(() => {
    fetchServices();

    const interval = setInterval(() => {
      fetchServices();
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(interval);
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
          <p>El trabajo ha sido concluido satisfactoriamente. Esperando Calificacion.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardTecnico;
