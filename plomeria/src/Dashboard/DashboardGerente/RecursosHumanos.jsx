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
    CodigoPostal: '',
  });

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/tecnicos', { withCredentials: true });
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/persona', {
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
        CodigoPostal: '',
      });
    } catch (err) {
      console.error('Error adding technician:', err);
      setError('Failed to add technician');
    }
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:3002/api/tecnicos/${employeeId}`, { withCredentials: true });
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
            <label className="block text-gray-700">Colonia</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Colonia"
              name="Colonia"
              value={formData.Colonia}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Alcaldía</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Alcaldía"
              name="Alcaldia"
              value={formData.Alcaldia}
              onChange={handleInputChange}
              required
            />
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
              {tecnicos.map(tecnico => (
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
