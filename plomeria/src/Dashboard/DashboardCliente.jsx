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
  const [servicioActual, setServicioActual] = useState(null);
  const [calificacion, setCalificacion] = useState('');
  const [comentario, setComentario] = useState('');
  const [sessionUser, setSessionUser] = useState(null);
  const navigate = useNavigate();

  const alcaldias = [
    "Álvaro Obregón",
    "Azcapotzalco",
    "Benito Juárez",
    "Coyoacán",
    "Cuajimalpa de Morelos",
    "Cuauhtémoc",
    "Gustavo A. Madero",
    "Iztacalco",
    "Iztapalapa",
    "La Magdalena Contreras",
    "Miguel Hidalgo",
    "Milpa Alta",
    "Tláhuac",
    "Tlalpan",
    "Venustiano Carranza",
    "Xochimilco"
  ];

  const coloniasPorAlcaldia = {
    "Álvaro Obregón": ["Santa Fe", "San Ángel", "Tizapan", "Olivar de los Padres"],
    "Azcapotzalco": ["San Álvaro", "Santa María Malinalco", "Nueva Santa María", "Victoria de las Democracias"],
    "Benito Juárez": ["Narvarte", "Del Valle", "Nápoles", "Nochebuena"],
    "Coyoacán": ["Del Carmen", "Santa Catarina", "Copilco", "Barrio de la Concepción"],
    "Cuajimalpa de Morelos": ["Cuajimalpa", "Contadero", "El Yaqui", "San Mateo Tlaltenango"],
    "Cuauhtémoc": ["Roma Norte", "Condesa", "Juárez", "Centro Histórico"],
    "Gustavo A. Madero": ["Lindavista", "Vallejo", "Cuchilla del Tesoro", "Nueva Vallejo"],
    "Iztacalco": ["Agrícola Oriental", "Granjas México", "Pantitlán", "Ramos Millán"],
    "Iztapalapa": ["Aculco", "Santa María Aztahuacán", "Santa Cruz Meyehualco", "San Lorenzo Tezonco"],
    "La Magdalena Contreras": ["San Jerónimo Lídice", "San Nicolás Totolapan", "Barranca Seca", "San Bernabé Ocotepec"],
    "Miguel Hidalgo": ["Polanco", "Lomas de Chapultepec", "Anzures", "Tacubaya"],
    "Milpa Alta": ["San Antonio Tecómitl", "San Pedro Atocpan", "San Agustín Ohtenco", "Villa Milpa Alta"],
    "Tláhuac": ["San Andrés Mixquic", "San Francisco Tlaltenco", "Santa Catarina Yecahuizotl", "Zapotitlán"],
    "Tlalpan": ["Fuentes Brotantes", "Pedregal de San Nicolás", "San Pedro Mártir", "Toriello Guerra"],
    "Venustiano Carranza": ["Jardín Balbuena", "Moctezuma", "Merced Balbuena", "Morelos"],
    "Xochimilco": ["San Francisco Caltongo", "San Gregorio Atlapulco", "Santa Cruz Acalpixca", "Santiago Tepalcatlalpan"]
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

    if (name === "Alcaldia") {
      setFormData((prevState) => ({
        ...prevState,
        Colonia: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.TipoServicio) errors.TipoServicio = "Tipo de servicio es requerido";
    if (!formData.Calle) errors.Calle = "Calle es requerida";
    if (!formData.NumeroExterior) errors.NumeroExterior = "Número Exterior es requerido";
    if (!formData.Colonia) errors.Colonia = "Colonia es requerida";
    if (!formData.Alcaldia) errors.Alcaldia = "Alcaldía es requerida";
    if (!formData.CodigoPostal || !/^\d{5}$/.test(formData.CodigoPostal)) errors.CodigoPostal = "Código Postal inválido";
    return errors;
  };

  const handleSolicitarServicioSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3002/api/servicios', {
          TipoServicio: formData.TipoServicio,
          Direccion: {
            Calle: formData.Calle,
            NumeroExterior: formData.NumeroExterior,
            NumeroInterior: formData.NumeroInterior,
            Colonia: formData.Colonia,
            Alcaldia: formData.Alcaldia,
            CodigoPostal: formData.CodigoPostal
          }
        }, {
          withCredentials: true
        });

        console.log(response.data);
        // Clear the form and show a success message
        setFormData({
          TipoServicio: "",
          Calle: "",
          NumeroExterior: "",
          NumeroInterior: "",
          Colonia: "",
          Alcaldia: "",
          CodigoPostal: ""
        });
        setFormErrors({});
        setFlippedSolicitar(false);
        alert("Servicio solicitado con éxito. Un técnico ha sido asignado.");
        setFlippedSolicitar(false);
        fetchServices(); // Refresh the list of services
      } catch (error) {
        console.error("Error submitting service request:", error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          setFormErrors({ general: "An error occurred during submission." });
        }
      }
    }
  };

  const handleSolicitarServicio = async () => {
    if (servicioActual) {
      alert("No puede solicitar más de un servicio a la vez");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3002/api/servicios/${sessionUser?.ID_Persona}`, { withCredentials: true });
      const currentService = response.data.find(servicio => servicio.Estado !== 'Completado' && servicio.Estado !== 'Pendiente');
      if (currentService) {
        alert("No puede solicitar más de un servicio a la vez");
        return;
      }
      setFlippedSolicitar(true);
    } catch (err) {
      console.error('Error fetching services:', err);
      alert('Error verificando los servicios');
    }
  };

  const handleBackSolicitar = () => {
    setFlippedSolicitar(false);
  };

  const handleServicioActual = (servicio) => {
    setServicioActual(servicio);
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

  const handleCalificarTecnico = async () => {
    try {
      console.log('Calificando servicio:', servicioActual);
      await axios.put(`http://localhost:3002/api/servicios/${servicioActual.ID_Servicio}`, {
        estado: 'Completado',
        calificacion: calificacion,
        comentario: comentario // Enviar el comentario
      }, {
        withCredentials: true
      });

      setFlippedServicioActual(false);
      setCalificacion('');
      setComentario('');
      fetchServices();
      alert('Servicio completado y técnico calificado con éxito.');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Error al calificar el técnico.');
    }
  };

  const canCalificar = (servicio) => {
    const result = (
      servicio.recogerMateriales &&
      servicio.dirigirseDireccion &&
      servicio.concluirTrabajo &&
      (servicio.Calificacion === null || servicio.Calificacion === undefined) &&
      servicio.Estado === 'Esperando Calificación'
    );
    console.log(`Puede calificar: ${result}`, servicio);
    return result;
  };

  const fetchServices = async () => {
    try {
      console.log(`Fetching services for user ${sessionUser?.ID_Persona}`);
      const response = await axios.get(`http://localhost:3002/api/servicios/${sessionUser?.ID_Persona}`, { withCredentials: true });
      console.log('Servicios recibidos:', response.data);
      setServicios(response.data);
      setLoading(false);
      const currentService = response.data.find(servicio => servicio.Estado !== 'Completado' && servicio.Estado !== 'Pendiente');
      console.log('Servicio actual:', currentService);
      if (currentService) {
        setServicioActual(currentService);
      } else {
        setServicioActual(null);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services');
      setLoading(false);
    }
  };

  const fetchSessionUser = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/session', { withCredentials: true });
      console.log('Session user:', response.data.user);
      setSessionUser(response.data.user);
    } catch (error) {
      console.error('Error fetching session user:', error);
      setError('Failed to fetch session user');
    }
  };

  useEffect(() => {
    fetchSessionUser();
  }, []);

  useEffect(() => {
    if (sessionUser) {
      fetchServices();
    }
  }, [sessionUser]);

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
                <path d="M2 3.5A2.5 2.5 0118 3.5V17a.5.5 01-.757.429L10 12.083 2.757 17.43A.5.5 012 17V3.5z" />
              </svg>
            </div>
            <span>Solicitar Servicio</span>
          </button>
          <button
            className="flex items-center space-x-4 w-full text-white justify-center"
            onClick={() => handleServicioActual(servicios.find(servicio => servicio.Estado !== 'Completado'))}
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
                    {formErrors.TipoServicio && <p className="text-red-500 text-xs italic">{formErrors.TipoServicio}</p>}
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
                      required
                    />
                    {formErrors.Calle && <p className="text-red-500 text-xs italic">{formErrors.Calle}</p>}
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
                        required
                      />
                      {formErrors.NumeroExterior && <p className="text-red-500 text-xs italic">{formErrors.NumeroExterior}</p>}
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
                    <label className="block text-gray-700">Alcaldía</label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
                      name="Alcaldia"
                      value={formData.Alcaldia}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione una alcaldía</option>
                      {alcaldias.map((alcaldia) => (
                        <option key={alcaldia} value={alcaldia}>
                          {alcaldia}
                        </option>
                      ))}
                    </select>
                    {formErrors.Alcaldia && <p className="text-red-500 text-xs italic">{formErrors.Alcaldia}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700">Colonia</label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
                      name="Colonia"
                      value={formData.Colonia}
                      onChange={handleInputChange}
                      disabled={!formData.Alcaldia}
                      required
                    >
                      <option value="">Seleccione una colonia</option>
                      {formData.Alcaldia &&
                        coloniasPorAlcaldia[formData.Alcaldia]?.map((colonia) => (
                          <option key={colonia} value={colonia}>
                            {colonia}
                          </option>
                        ))}
                    </select>
                    {formErrors.Colonia && <p className="text-red-500 text-xs italic">{formErrors.Colonia}</p>}
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
                      required
                    />
                    {formErrors.CodigoPostal && <p className="text-red-500 text-xs italic">{formErrors.CodigoPostal}</p>}
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
                  onClick={() => handleServicioActual(servicios.find(servicio => servicio.Estado !== 'Completado'))}
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
                {servicioActual ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Servicio Actual</h2>
                    <p>Tipo de Servicio: {servicioActual.TipoServicio}</p>
                    <p>Estado: {servicioActual.Estado}</p>
                    {canCalificar(servicioActual) ? (
                      <div className="flex flex-col items-center mt-4">
                        <label className="block text-gray-700">Calificación del Técnico</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="number"
                          min="1"
                          max="5"
                          step="1"
                          value={calificacion}
                          onChange={(e) => setCalificacion(e.target.value)}
                          placeholder="Calificación (1-5)"
                        />
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          placeholder="Deje su comentario (opcional)"
                        />
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                          onClick={handleCalificarTecnico}
                        >
                          Calificar y Completar Servicio
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center mt-4">
                        <ul className="list-disc list-inside">
                          <li>{servicioActual.recogerMateriales ? "Materiales recogidos " : "Materiales pendientes"}</li>
                          <li>{servicioActual.dirigirseDireccion ? "En camino a la dirección" : "Dirección pendiente"}</li>
                          <li>{servicioActual.concluirTrabajo ? "Trabajo: concluido" : "Trabajo pendiente"}</li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <h2 className="text-xl font-bold mb-4">No hay servicios actuales en curso</h2>
                )}
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
