import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const GraficoBarras = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: 'Servicios',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/estadisticas', { withCredentials: true });
        const estadisticas = response.data;

        setData({
          labels: ['Total Solicitados', 'Total Completados'],
          datasets: [{
            label: 'Servicios',
            data: [estadisticas.totalSolicitados, estadisticas.totalCompletados],
            backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(153,102,255,0.4)'],
            borderColor: ['rgba(75,192,192,1)', 'rgba(153,102,255,1)'],
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
      <h2>Servicios Solicitados y Completados</h2>
      <Bar data={data} />
    </div>
  );
};

export default GraficoBarras;
