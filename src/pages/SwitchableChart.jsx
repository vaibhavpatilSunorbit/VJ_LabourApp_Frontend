import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { BarChartRounded, PieChartRounded } from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SwitchableChart = ({ title, data }) => {
  const [chartType, setChartType] = useState('bar');
  const theme = useTheme();

  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
            size="small"
          >
            <ToggleButton value="bar" aria-label="bar chart">
              <BarChartRounded />
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              <PieChartRounded />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Box height={300}>
          {chartType === 'bar' ? (
            <Bar options={barOptions} data={data} />
          ) : (
            <Pie options={pieOptions} data={data} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SwitchableChart;
