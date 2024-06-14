import { useState } from 'react';

const RecursosHumanos = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddEmployeeClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Aquí manejar la lógica para enviar el formulario al backend
    setShowForm(false);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleDeleteEmployee = (employeeId) => {
    // Aquí manejar la lógica para eliminar al empleado del backend
    console.log(`Eliminar empleado con ID: ${employeeId}`);
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
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Correo Electrónico"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Calle</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Calle"
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
                required
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
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Alcaldía</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Alcaldía"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Código Postal</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Código Postal"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Servicios Ofrecidos</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option>Mantenimiento preventivo y lavado de tinacos</option>
              <option>Reparación de fuga de agua</option>
              <option>Instalación de calentador de agua</option>
            </select>
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
          {/* Aquí se mostrará la lista de empleados y sus estadísticas */}
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Empleado 1 - Tarea actual: Ninguna
              <button 
                onClick={() => handleDeleteEmployee(1)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
              >
                Despedir
              </button>
            </li>
            <li>
              Empleado 2 - Tarea actual: En proceso
              <button 
                onClick={() => handleDeleteEmployee(2)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
              >
                Despedir
              </button>
            </li>
            <li>
              Empleado 3 - Tarea actual: Completada
              <button 
                onClick={() => handleDeleteEmployee(3)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
              >
                Despedir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecursosHumanos;
