import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/material', { withCredentials: true }); // Assuming credentials are needed
        setMateriales(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchMateriales(); 
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Inventario</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">ID</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Material</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Cantidad</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((material) => (
              <tr key={material.ID_Material}>
                <td className="py-2 px-4 border-b border-gray-300">{material.ID_Material}</td>
                <td className="py-2 px-4 border-b border-gray-300">{material.Nombre}</td>
                <td className="py-2 px-4 border-b border-gray-300">{material.CantidadDisponible}</td>
                <td className="py-2 px-4 border-b border-gray-300">Descripción del material</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventario;
