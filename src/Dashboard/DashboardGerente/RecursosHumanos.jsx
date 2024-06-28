import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecursosHumanos = () => {
  const [showForm, setShowForm] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    CorreoElectronico: '',
    Contrasena: '',
    Calle: '',
    NumeroExterior: '',
    NumeroInterior: '',
    Colonia: '',
    Alcaldia: '',
    CodigoPostal: ''
  });
  const [formErrors, setFormErrors] = useState({});

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

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await axios.get('https://plomeria-backend.azurewebsites.net/api/tecnicos', { withCredentials: true });
        setTecnicos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchTecnicos();
  }, []);

  const handleAddEmployeeClick = () => {
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.Nombre) errors.Nombre = "Nombre es requerido";
    if (!formData.CorreoElectronico || !/\S+@\S+\.\S+/.test(formData.CorreoElectronico)) errors.CorreoElectronico = "Correo electrónico inválido";
    if (!formData.Contrasena) errors.Contrasena = "Contraseña es requerida";
    if (!formData.Calle) errors.Calle = "Calle es requerida";
    if (!formData.NumeroExterior) errors.NumeroExterior = "Número Exterior es requerido";
    if (!formData.Colonia) errors.Colonia = "Colonia es requerida";
    if (!formData.Alcaldia) errors.Alcaldia = "Alcaldía es requerida";
    if (!formData.CodigoPostal || !/^\d{5}$/.test(formData.CodigoPostal)) errors.CodigoPostal = "Código Postal inválido";
    return errors;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('https://plomeria-backend.azurewebsites.net/api/persona', {
          ...formData,
          Rol: 'Tecnico'
        }, { withCredentials: true });

        setTecnicos([...tecnicos, response.data]);
        setShowForm(false);
        setFormData({
          Nombre: '',
          CorreoElectronico: '',
          Contrasena: '',
          Calle: '',
          NumeroExterior: '',
          NumeroInterior: '',
          Colonia: '',
          Alcaldia: '',
          CodigoPostal: ''
        });
      } catch (err) {
        console.error('Error adding technician:', err);
        setError('Failed to add technician');
      }
    }
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`https://plomeria-backend.azurewebsites.net/api/tecnicos/${employeeId}`, { withCredentials: true });
      setTecnicos(tecnicos.filter(tecnico => tecnico.ID_Persona !== employeeId));
    } catch (err) {
      console.error('Error deleting technician:', err);
      setError('Failed to delete technician');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Recursos Humanos</h2>

      {!showForm ? (
        <div className="mb-4">
          <button
            onClick={handleAddEmployeeClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar Empleado
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleInputChange}
              required
            />
            {formErrors.Nombre && <p className="text-red-500 text-xs italic">{formErrors.Nombre}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Correo Electrónico"
              name="CorreoElectronico"
              value={formData.CorreoElectronico}
              onChange={handleInputChange}
              required
            />
            {formErrors.CorreoElectronico && <p className="text-red-500 text-xs italic">{formErrors.CorreoElectronico}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Contraseña"
              name="Contrasena"
              value={formData.Contrasena}
              onChange={handleInputChange}
              required
            />
            {formErrors.Contrasena && <p className="text-red-500 text-xs italic">{formErrors.Contrasena}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Calle</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Calle"
              name="Calle"
              value={formData.Calle}
              onChange={handleInputChange}
              required
            />
            {formErrors.Calle && <p className="text-red-500 text-xs italic">{formErrors.Calle}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Número Exterior</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Número Exterior"
                name="NumeroExterior"
                value={formData.NumeroExterior}
                onChange={handleInputChange}
                required
              />
              {formErrors.NumeroExterior && <p className="text-red-500 text-xs italic">{formErrors.NumeroExterior}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Número Interior</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Número Interior"
                name="NumeroInterior"
                value={formData.NumeroInterior}
                onChange={handleInputChange}
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
              type="text"
              placeholder="Código Postal"
              name="CodigoPostal"
              value={formData.CodigoPostal}
              onChange={handleInputChange}
              required
            />
            {formErrors.CodigoPostal && <p className="text-red-500 text-xs italic">{formErrors.CodigoPostal}</p>}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Cuenta
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Lista de Empleados</h2>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {tecnicos.map((tecnico) => (
                <li key={tecnico.ID_Persona}>
                  {tecnico.Nombre} - Tarea actual: {tecnico.TareaActual || 'Disponible'} - Disponible: {tecnico.Disponible ? 'Sí' : 'No'}
                  <button
                    onClick={() => handleDeleteEmployee(tecnico.ID_Persona)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
                  >
                    Despedir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecursosHumanos;
