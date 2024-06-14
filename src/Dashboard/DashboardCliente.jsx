import { useState } from 'react';
import { BellAlertIcon, UserCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

const DashboardCliente = () => {
  const [flippedSolicitar, setFlippedSolicitar] = useState(false);
  const [flippedServicioActual, setFlippedServicioActual] = useState(false);

  const handleSolicitarServicio = () => {
    setFlippedSolicitar(true);
  };

  const handleBackSolicitar = () => {
    setFlippedSolicitar(false);
  };

  const handleServicioActual = () => {
    setFlippedServicioActual(true);
  };

  const handleBackServicioActual = () => {
    setFlippedServicioActual(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <div className="w-1/6 bg-[#34495E] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <button className="flex items-center space-x-4 w-full text-white justify-center" onClick={handleSolicitarServicio}>
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3.5A2.5 2.5 0 014.5 1h11A2.5 2.5 0 0118 3.5V17a.5.5 0 01-.757.429L10 12.083 2.757 17.43A.5.5 0 012 17V3.5z" />
              </svg>
            </div>
            <span>Solicitar Servicio</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center" onClick={handleServicioActual}>
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Servicio Actual</span>
          </button>
        </div>
      </div>

      {/* Panel principal */}
      <div className="w-5/6 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Panel Cliente</h1>
          <div className="flex items-center space-x-4">
            <button>
              <BellAlertIcon className="h-8 w-8 text-gray-700"/>
            </button>
            <button>
              <UserCircleIcon className='h-8 w-8 text-gray-700'/>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Card con animación de giro para Solicitar Servicio */}
          <div className={`bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-500 ${flippedSolicitar ? 'rotate-y-180' : ''}`} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full min-h-full overflow-hidden">
              {/* Frente de la tarjeta */}
              <div className={`absolute inset-0 flex items-center justify-center ${flippedSolicitar ? 'hidden' : 'flex'}`}>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                  type="button"
                  onClick={handleSolicitarServicio}
                >
                  Solicitar Servicio
                </button>
              </div>
              {/* Parte trasera de la tarjeta */}
              <div className={`absolute inset-0 bg-white p-4 rounded-lg ${flippedSolicitar ? 'flex' : 'hidden'} flex-col overflow-y-auto`}>
                <h2 className="text-xl font-bold mb-4">Solicitar Servicio</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Tipo de Servicio</label>
                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      <option>Mantenimiento preventivo y lavado de tinacos</option>
                      <option>Reparación de fuga de agua</option>
                      <option>Instalación de calentador de agua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">Calle</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Calle"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-700">Número Exterior</label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Número Exterior"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-700">Número Interior</label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Número Interior"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700">Colonia</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Colonia"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Alcaldía</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Alcaldía"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Código Postal</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Código Postal"
                    />
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Enviar Solicitud
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                    type="button"
                    onClick={handleBackSolicitar}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Card con animación de giro para Servicio Actual */}
          <div className={`bg-white shadow-lg rounded-lg p-4 h-96 transform transition-transform duration-500 ${flippedServicioActual ? 'rotate-y-180' : ''}`} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full">
              {/* Frente de la tarjeta */}
              <div className={`absolute inset-0 flex items-center justify-center ${flippedServicioActual ? 'hidden' : 'flex'}`}>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                  type="button"
                  onClick={handleServicioActual}
                >
                  Servicio Actual
                </button>
              </div>
              {/* Parte trasera de la tarjeta */}
              <div className={`absolute inset-0 bg-white p-4 rounded-lg ${flippedServicioActual ? 'flex' : 'hidden'} flex-col items-center justify-center`}>
                <h2 className="text-xl font-bold mb-4">No hay servicios actuales en curso</h2>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                  type="button"
                  onClick={handleBackServicioActual}
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCliente;
