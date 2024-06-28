import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get('plomeria-backend.azurewebsites.net/api/material', { withCredentials: true });
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

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
  };

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`plomeria-backend.azurewebsites.net/api/material/${selectedMaterial}`, {
        cantidad: parseInt(cantidad)
      }, { withCredentials: true });

      const updatedMateriales = materiales.map((material) => {
        if (material.ID_Material === parseInt(selectedMaterial)) {
          return { ...material, CantidadDisponible: material.CantidadDisponible + parseInt(cantidad) };
        }
        return material;
      });

      setMateriales(updatedMateriales);
      setCantidad(0);
      setSelectedMaterial(null);
      alert('Material actualizado con éxito');
    } catch (err) {
      console.error('Error updating material:', err);
      setError('Failed to update material');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Inventario</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Actualizar Inventario</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Material</label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedMaterial || ''}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Seleccione un material</option>
                  {materiales.map((material) => (
                    <option key={material.ID_Material} value={material.ID_Material}>
                      {material.Nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Cantidad a Agregar</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  min="0"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Actualizar Inventario
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Inventario;
