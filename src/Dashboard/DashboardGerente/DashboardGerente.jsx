import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { BellAlertIcon, UserCircleIcon, PresentationChartBarIcon, InboxIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import RecursosHumanos from './RecursosHumanos';
import Inventario from './Inventario';
import Estadisticas from './Estadisticas';
import axios from 'axios';
import { useState } from 'react';
import GraficoBarras from './GraficoBarras';
import GraficoInventario from './GraficoInventario';
import GraficoCostos from './GraficoCostos'; // Importa el nuevo componente de gráfico

const DashboardGerente = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://plomeria-backend.azurewebsites.net/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <div className="w-1/6 bg-[#34495E] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <Link to="inventario" className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <InboxIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Inventario</span>
          </Link>
          <Link to="estadisticas" className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <PresentationChartBarIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Estadísticas</span>
          </Link>
          <Link to="recursos-humanos" className="flex items-center space-x-4 w-full text-white justify-center">
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-8 w-8 text-white"/>
            </div>
            <span>Recursos <br /> Humanos</span>
          </Link>
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
            <div className="relative">
              <button onClick={() => setUserMenuVisible(!userMenuVisible)}>
                <UserCircleIcon className='h-8 w-8 text-gray-700'/>
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
        </div>
        <Routes>
          <Route path="inventario" element={<Inventario />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="recursos-humanos" element={<RecursosHumanos />} />
          <Route path="/" element={
            <div className="grid grid-cols-2 gap-8">
              {/* Recuadro de recursos humanos */}
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Recursos humanos</h2>
                <GraficoBarras /> {/* Coloca el componente de gráfico aquí */}
              </div>
              {/* Recuadro de costos */}
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Costos</h2>
                <GraficoCostos /> {/* Coloca el componente de gráfico aquí */}
              </div>
              {/* Recuadro de inventario */}
              <div className="col-span-2 bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Inventario</h2>
                <GraficoInventario /> {/* Coloca el componente de gráfico aquí */}
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardGerente;
