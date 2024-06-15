import { useState } from 'react';

const DashboardTecnico = () => {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [materialesSolicitados, setMaterialesSolicitados] = useState([]);
  const [reparacionEnCurso, setReparacionEnCurso] = useState(null);
  const [evidencia, setEvidencia] = useState(null);
  const [tareasCompletadas, setTareasCompletadas] = useState({
    recogerMateriales: false,
    dirigirseDireccion: false,
    concluirTrabajo: false
  });

  const handleSeleccionarSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setReparacionEnCurso(solicitud);
    setTareasCompletadas({
      recogerMateriales: false,
      dirigirseDireccion: false,
      concluirTrabajo: false
    });
  };

  const handleSolicitarMateriales = (materiales) => {
    setMaterialesSolicitados(materiales);
    setTareasCompletadas((prev) => ({ ...prev, recogerMateriales: true }));
  };

  const handleEvidenciaChange = (event) => {
    setEvidencia(event.target.files[0]);
  };

  const handleConcluirTrabajo = () => {
    // Lógica para concluir el trabajo y subir la evidencia
    console.log('Trabajo concluido con evidencia:', evidencia);
    setTareasCompletadas((prev) => ({ ...prev, concluirTrabajo: true }));
  };

  const handleMarcarDireccion = () => {
    setTareasCompletadas((prev) => ({ ...prev, dirigirseDireccion: true }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Panel Técnico</h1>

      {/* Sección de solicitudes de reparación */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Solicitudes de Reparación</h2>
        <ul className="space-y-4">
          <li>
            <button
              className="w-full text-left bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSeleccionarSolicitud({ id: 1, ubicacion: 'Calle Falsa 123' })}
            >
              Reparación en Calle Falsa 123
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSeleccionarSolicitud({ id: 2, ubicacion: 'Avenida Siempreviva 742' })}
            >
              Reparación en Avenida Siempreviva 742
            </button>
          </li>
        </ul>
      </div>

      {/* Sección de solicitud de materiales */}
      {solicitudSeleccionada && !tareasCompletadas.recogerMateriales && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Solicitar Materiales</h2>
          <div>
            <label className="block text-gray-700">Materiales Necesarios</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="5"
              value="Materiales sugeridos según el tipo de reparación"
              readOnly
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => handleSolicitarMateriales(['Material 1', 'Material 2'])}
          >
            Tengo los Materiales 
          </button>
        </div>
      )}

      {/* Sección de dirigirse a la dirección */}
      {solicitudSeleccionada && tareasCompletadas.recogerMateriales && !tareasCompletadas.dirigirseDireccion && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Dirigirse a la Dirección</h2>
          <p><strong>Ubicación:</strong> {solicitudSeleccionada.ubicacion}</p>
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
          <p><strong>Ubicación:</strong> {reparacionEnCurso.ubicacion}</p>
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
