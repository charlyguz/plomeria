import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar las escalas necesarias
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoInventario = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: 'Cantidad Disponible',
      data: [],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://plomeria-backend.azurewebsites.net/api/material', { withCredentials: true });
        const materiales = response.data;

        setData({
          labels: materiales.map(material => material.Nombre),
          datasets: [{
            label: 'Cantidad Disponible',
            data: materiales.map(material => material.CantidadDisponible),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Inventario de Materiales</h2>
      <Bar data={data} />
    </div>
  );
};

export default GraficoInventario;
