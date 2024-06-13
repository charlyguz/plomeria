import { BellAlertIcon, UserCircleIcon, PresentationChartBarIcon,InboxIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const DashboardGerente = () => {
  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <div className="w-1/6 bg-[#34495E] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <InboxIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Inventario</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              
              <PresentationChartBarIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Estadisticas</span>
          </button>
          <button className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Recursos <br /> Humanos</span>
          </button>
        </div>
      </div>

      {/* Panel principal */}
      <div className="w-5/6 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Panel Gerente</h1>
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
