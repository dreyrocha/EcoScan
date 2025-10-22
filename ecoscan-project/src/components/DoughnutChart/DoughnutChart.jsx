import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './DoughnutChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Adicionamos a prop 'unit' com um valor padrão de 'kg'
function DoughnutChart({ chartData, unit = 'kg' }) {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ecf0f1',
          font: {
            size: 14,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              
              const value = context.parsed;
              const unitLabel = value === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit;
              label += value + ' ' + unitLabel;
            }
            return label;
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default DoughnutChart;