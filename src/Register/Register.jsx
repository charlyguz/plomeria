import React from 'react';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="relative w-full h-full">
          <div className="relative top-16">
            <h2 className="text-5xl font-semibold text-center mb-6 text-white">Registro</h2>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-5/6 bg-white rounded-tl-full"></div>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-lg border-2 border-gray-600 p-8 max-w-md w-full z-30 flex items-center justify-center">
        <form className="w-full">
          <h3 className="text-xl font-semibold text-center mb-4">Formulario de registro</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Correo Electrónico"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Clave de Acceso
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Clave de Acceso"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmar Clave de Acceso
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirmar Clave de Acceso"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
