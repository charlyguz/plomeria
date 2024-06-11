import { BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const DashboardGerente = () => {
  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <div className="w-1/6 bg-[#34495E] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3.5A2.5 2.5 0 014.5 1h11A2.5 2.5 0 0118 3.5V17a.5.5 0 01-.757.429L10 12.083 2.757 17.43A.5.5 0 012 17V3.5z" />
              </svg>
            </div>
            <span>Opciones 1</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3.5A2.5 2.5 0 015.5 1h9A2.5 2.5 0 0117 3.5v9A2.5 2.5 0 0114.5 15h-9A2.5 2.5 0 013 12.5v-9zM5 6a1 1 0 000 2h6a1 1 0 100-2H5zm0 4a1 1 0 000 2h3a1 1 0 100-2H5z" />
              </svg>
            </div>
            <span>Opciones 2</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a1 1 0 00-1 1v2h12V4a1 1 0 00-1-1H5zM4 7v10h12V7H4z" />
              </svg>
            </div>
            <span>Opciones 3</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v4a1 1 0 01-2 0V4a1 1 0 011-1zM4 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zM15 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" />
              </svg>
            </div>
            <span>Opciones 4</span>
          </button>
        </div>
      </div>

      {/* Panel principal */}
      <div className="w-5/6 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Panel</h1>
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
          {/* Recuadro de recursos humanos */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Recursos humanos</h2>
            <img src="/path/to/bar_chart.png" alt="Gráfico de barras" />
          </div>
          {/* Recuadro de costos */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Costos</h2>
            <div className="text-3xl font-bold">$88,099 mx</div>
            <div className="text-green-500 text-xl">23% ↑</div>
            <img src="/path/to/line_chart.png" alt="Gráfico de líneas" />
          </div>
          {/* Recuadro de inventario */}
          <div className="col-span-2 bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Inventario</h2>
            <img src="/path/to/line_chart.png" alt="Gráfico de líneas" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGerente;
