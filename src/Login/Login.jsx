import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userType, setUserType] = useState('cliente');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/dashboard/${userType}`);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="relative w-full h-full">
          <div className="relative top-28">
            <h2 className="text-5xl font-semibold text-center mb-6 text-white">Acceso</h2>
            <div className="flex justify-center mb-6">
              <button
                className={`py-2 px-4 rounded-l-lg md:text-2xl text-lg ${userType === 'cliente' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setUserType('cliente')}
              >
                Cliente
              </button>
              <button
                className={`py-2 px-4 md:text-2xl text-lg ${userType === 'tecnico' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setUserType('tecnico')}
              >
                Técnico
              </button>
              <button
                className={`py-2 px-4 rounded-r-lg md:text-2xl text-lg ${userType === 'gerente' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setUserType('gerente')}
              >
                Gerente
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-4/6 bg-white rounded-tl-full"></div>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-lg border-2 border-gray-600 p-8 max-w-md w-full z-30 flex items-center justify-center">
        <form className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="***********"
            />
          </div>
          <div className="flex flex-col items-start">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              type="button"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            <a className="block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mb-2 cursor-pointer" onClick={handleRegister}>
              Registrarse
            </a>
            <a className="block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
