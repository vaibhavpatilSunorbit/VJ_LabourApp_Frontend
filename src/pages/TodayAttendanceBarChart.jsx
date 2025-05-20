import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TodayAttendanceBarChart = ({ data }) => {
  const chartData = {
    labels: ['Present', 'Absent', 'Miss Punch'],
    datasets: [
      {
        label: 'Count',
        data: [data.present, data.absent, data.missPunch],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',   // Present - Teal
          'rgba(255, 99, 132, 0.6)',   // Absent - Red
          'rgba(255, 206, 86, 0.6)'    // Miss Punch - Yellow
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const maxValue = Math.max(data.present, data.absent, data.missPunch);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for custom height
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Yesterday's Labour Attendance",
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} workers`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxValue, // Makes tallest bar reach near top
        title: {
          display: true,
          text: 'Number of Workers'
        },
        ticks: {
          precision: 0
        }
      },
      x: {
        title: {
          display: true,
          text: 'Attendance Status'
        }
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ height: 480, width: '100%' }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodayAttendanceBarChart;
