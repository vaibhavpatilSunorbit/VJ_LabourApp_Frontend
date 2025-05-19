import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceLineGraph = ({ attendanceData = sampleAttendanceData }) => {
  const [timeRange, setTimeRange] = useState('week');

  // Filter data based on selected time range
  const getFilteredData = () => {
    const currentDate = new Date();
    let filteredData = [...attendanceData];
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
      filteredData = attendanceData.filter(item => new Date(item.date) >= oneWeekAgo);
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      filteredData = attendanceData.filter(item => new Date(item.date) >= oneMonthAgo);
    }
    
    return filteredData;
  };

  const filteredData = getFilteredData();
  
  // Prepare data for Chart.js
  const chartData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Present',
        data: filteredData.map(item => item.present),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: filteredData.map(item => item.absent),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'On Leave',
        data: filteredData.map(item => item.onLeave),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Labor Attendance',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} workers`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Workers',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Labor Attendance Trends
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ height: 400 }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Sample attendance data (30 days)
const sampleAttendanceData = [
  { date: '2023-05-01', present: 45, absent: 5, onLeave: 2 },
  { date: '2023-05-02', present: 48, absent: 3, onLeave: 1 },
  { date: '2023-05-03', present: 42, absent: 7, onLeave: 3 },
  { date: '2023-05-04', present: 46, absent: 4, onLeave: 2 },
  { date: '2023-05-05', present: 44, absent: 6, onLeave: 2 },
  { date: '2023-05-06', present: 40, absent: 8, onLeave: 4 },
  { date: '2023-05-07', present: 38, absent: 10, onLeave: 4 },
  { date: '2023-05-08', present: 47, absent: 3, onLeave: 2 },
  { date: '2023-05-09', present: 49, absent: 2, onLeave: 1 },
  { date: '2023-05-10', present: 50, absent: 1, onLeave: 1 },
  { date: '2023-05-11', present: 48, absent: 3, onLeave: 1 },
  { date: '2023-05-12', present: 47, absent: 4, onLeave: 1 },
  { date: '2023-05-13', present: 45, absent: 5, onLeave: 2 },
  { date: '2023-05-14', present: 43, absent: 6, onLeave: 3 },
  { date: '2023-05-15', present: 46, absent: 4, onLeave: 2 },
  { date: '2023-05-16', present: 47, absent: 3, onLeave: 2 },
  { date: '2023-05-17', present: 49, absent: 2, onLeave: 1 },
  { date: '2023-05-18', present: 48, absent: 3, onLeave: 1 },
  { date: '2023-05-19', present: 47, absent: 4, onLeave: 1 },
  { date: '2023-05-20', present: 42, absent: 7, onLeave: 3 },
  { date: '2023-05-21', present: 40, absent: 8, onLeave: 4 },
  { date: '2023-05-22', present: 44, absent: 5, onLeave: 3 },
  { date: '2023-05-23', present: 46, absent: 4, onLeave: 2 },
  { date: '2023-05-24', present: 48, absent: 3, onLeave: 1 },
  { date: '2023-05-25', present: 49, absent: 2, onLeave: 1 },
  { date: '2023-05-26', present: 47, absent: 3, onLeave: 2 },
  { date: '2023-05-27', present: 45, absent: 5, onLeave: 2 },
  { date: '2023-05-28', present: 43, absent: 6, onLeave: 3 },
  { date: '2023-05-29', present: 46, absent: 4, onLeave: 2 },
  { date: '2023-05-30', present: 48, absent: 3, onLeave: 1 },
];

export default AttendanceLineGraph;
