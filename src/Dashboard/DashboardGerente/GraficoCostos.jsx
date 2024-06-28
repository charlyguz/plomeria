import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar las escalas necesarias
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const GraficoCostos = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Costos',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: true
      },
      {
        label: 'Ingresos',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('plomeria-backend.azurewebsites.net/api/estadisticas', { withCredentials: true });
        const { costosYBeneficios } = response.data;

        setData({
          labels: ['Costos', 'Ingresos', 'Beneficio Neto'],
          datasets: [
            {
              label: 'Costos',
              data: [costosYBeneficios.costos],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              fill: true
            },
            {
              label: 'Ingresos',
              data: [costosYBeneficios.ingresos],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: true
            },
            {
              label: 'Beneficio Neto',
              data: [costosYBeneficios.beneficioNeto],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: true
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Costos y Beneficios</h2>
      <Line data={data} />
    </div>
  );
};

export default GraficoCostos;
