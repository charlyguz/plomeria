import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = "Correo electrónico inválido";
    if (!password) errors.password = "Contraseña es requerida";
    if (password !== confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('https://plomeria-backend.azurewebsites.net/api/persona', {
          CorreoElectronico: email,
          Contrasena: password,
          Rol: 'Cliente'
        },{
          withCredentials: true
        });

        console.log(response.data);
        // Clear the form, redirect, or show a success message
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        setSuccessMessage('Registro exitoso. Por favor, inicie sesión.');
      } catch (error) {
        console.error('Error registering:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors); // Set errors from backend
        } else {
          setErrors({ general: 'An error occurred during registration.' });
        }
      }
    }
  };

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
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
              type="email" 
              id="email" 
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Clave de Acceso</label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
              type="password" 
              id="password" 
              placeholder="Clave de Acceso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Clave de Acceso</label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input-field"
              type="password" 
              id="confirmPassword" 
              placeholder="Confirmar Clave de Acceso"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Registrarse
            </button>
            <button 
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => window.location.href = '/login'}
            >
              Ir a Iniciar Sesión
            </button>
          </div>

          {/* Success Message */}
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

          {/* General Error Message */}
          {errors.general && <p className="text-red-500 text-xs italic">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
