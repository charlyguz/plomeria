import { useState, useEffect } from "react";
import {
  BellAlertIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const DashboardCliente = () => {
  const [flippedSolicitar, setFlippedSolicitar] = useState(false);
  const [flippedServicioActual, setFlippedServicioActual] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3002/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const [formData, setFormData] = useState({
    TipoServicio: "",
    Calle: "",
    NumeroExterior: "",
    NumeroInterior: "",
    Colonia: "",
    Alcaldia: "",
    CodigoPostal: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSolicitarServicioSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/api/servicios", // Corregir la URL
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setFormData({
        TipoServicio: "",
        Calle: "",
        NumeroExterior: "",
        NumeroInterior: "",
        Colonia: "",
        Alcaldia: "",
        CodigoPostal: "",
      });
      setFlippedSolicitar(false);
    } catch (error) {
      console.error("Error submitting service request:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setFormErrors({ general: "An error occurred during submission." });
      }
    }
  };

  // Esta función trae todos los servicios de la base de datos para que puedan presentarlos con HTML
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/servicios', { // Corregir la URL
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

  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <div className="w-1/6 bg-[#34495E] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <button
            className="flex items-center space-x-4 w-full text-white justify-center"
            onClick={handleSolicitarServicio}
          >
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3.5A2.5 2.5 0 014.5 1h11A2.5 2.5 0 0118 3.5V17a.5.5 0 01-.757.429L10 12.083 2.757 17.43A.5.5 0 012 17V3.5z" />
              </svg>
            </div>
            <span>Solicitar Servicio</span>
          </button>
          <button
            className="flex items-center space-x-4 w-full text-white justify-center"
            onClick={handleServicioActual}
          >
            <div className="bg-[#6E7AD9] p-4 rounded-full flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
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
              <BellAlertIcon className="h-8 w-8 text-gray-700" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuVisible(!userMenuVisible)}>
                <UserCircleIcon className="h-8 w-8 text-gray-700" />
              </button>
              {userMenuVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hover:bg-red-500 py-1 z-40 ">
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
        <div className="grid grid-cols-2 gap-8">
          {/* Card con animación de giro para Solicitar Servicio */}
          <div
            className={`bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-500 ${
              flippedSolicitar ? "rotate-y-180" : ""
            }`}
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full h-full min-h-full overflow-hidden">
              {/* Frente de la tarjeta */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  flippedSolicitar ? "hidden" : "flex"
                }`}
              >
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                  type="button"
                  onClick={handleSolicitarServicio}
                >
                  Solicitar Servicio
                </button>
              </div>
              {/* Parte trasera de la tarjeta */}
              <div
                className={`absolute inset-0 bg-white p-4 rounded-lg ${
                  flippedSolicitar ? "flex" : "hidden"
                } flex-col overflow-y-auto`}
              >
                <h2 className="text-xl font-bold mb-4">Solicitar Servicio</h2>
                <form
                  className="space-y-4"
                  onSubmit={handleSolicitarServicioSubmit}
                >
                  <div>
                    <label className="block text-gray-700">
                      Tipo de Servicio
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
                      name="TipoServicio"
                      value={formData.TipoServicio}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un servicio</option>{" "}
                      {/* Added default option */}
                      <option value="Mantenimiento preventivo y lavado de tinacos">
                        Mantenimiento preventivo y lavado de tinacos
                      </option>
                      <option value="Reparación de fuga de agua">
                        Reparación de fuga de agua
                      </option>
                      <option value="Instalación de calentador de agua">
                        Instalación de calentador de agua
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">Calle</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="Calle"
                      value={formData.Calle}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Calle"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-700">
                        Número Exterior
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="NumeroExterior"
                        value={formData.NumeroExterior}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Número Exterior"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-700">
                        Número Interior
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="NumeroInterior"
                        value={formData.NumeroInterior} 
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Número Interior"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700">Colonia</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="Colonia"
                      value={formData.Colonia}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Colonia"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Alcaldía</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="Alcaldia"
                      value={formData.Alcaldia}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Alcaldía"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Código Postal</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="CodigoPostal"
                      value={formData.CodigoPostal}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Código Postal"
                    />
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
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
          <div
            className={`bg-white shadow-lg rounded-lg p-4 h-96 transform transition-transform duration-500 ${
              flippedServicioActual ? "rotate-y-180" : ""
            }`}
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full h-full">
              {/* Frente de la tarjeta */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  flippedServicioActual ? "hidden" : "flex"
                }`}
              >
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                  type="button"
                  onClick={handleServicioActual}
                >
                  Servicio Actual
                </button>
              </div>
              {/* Parte trasera de la tarjeta */}
              <div
                className={`absolute inset-0 bg-white p-4 rounded-lg ${
                  flippedServicioActual ? "flex" : "hidden"
                } flex-col items-center justify-center`}
              >
                <h2 className="text-xl font-bold mb-4">
                  No hay servicios actuales en curso
                </h2>
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
};

export default DashboardCliente;
