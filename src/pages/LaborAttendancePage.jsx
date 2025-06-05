import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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
import { API_BASE_URL } from '../Data';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const AttendanceLineGraph = () => {
  const [timeRange, setTimeRange] = useState('lastWeek'); // Set default to lastWeek
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when component mounts or timeRange changes
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Change this URL to your actual backend API URL
        const response = await axios.get(`${API_BASE_URL}/api/getAllAPM`, {
          params: { period: timeRange } // lastWeek, lastMonth, allTime as per your backend
        });

        if (response.data.success) {
          // The API should return an array like:
          // [{ Date: '2025-05-01', Status: 'P', Count: 40 }, ...]
          const rawData = response.data.data;
          
          // Transform raw data to { date, present, absent, onLeave } format
          const groupedByDate = {};
          rawData.forEach(item => {
            // Extract only the date part (YYYY-MM-DD) from the full date string
            const fullDate = item.Date || item.date;
            const date = fullDate.split('T')[0]; // This will extract only the date part
            
            if (!groupedByDate[date]) {
              groupedByDate[date] = { date, present: 0, absent: 0, missPunch: 0 };
            }
            
            if (item.Status === 'P') groupedByDate[date].present = item.Count;
            else if (item.Status === 'A') groupedByDate[date].absent = item.Count;
            else if (item.Status === 'MP') groupedByDate[date].missPunch = item.Count;
          });
          
          setAttendanceData(Object.values(groupedByDate));
        } else {
          setError('Failed to fetch data');
          setAttendanceData([]);
        }
      } catch (err) {
        setError('Error loading attendance data');
        setAttendanceData([]);
        console.error(err);
      }
      setLoading(false);
    };

    fetchAttendanceData();
  }, [timeRange]);

  // Chart data setup
  const chartData = {
    labels: attendanceData.map(item => item.date),
    datasets: [
      {
        label: 'Present',
        data: attendanceData.map(item => item.present),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: attendanceData.map(item => item.absent),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Miss Punch',
        data: attendanceData.map(item => item.missPunch),
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
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Daily Labor Attendance',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.raw} workers`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Workers' },
        ticks: { precision: 0 },
      },
      x: {
        title: { display: true, text: 'Date' },
      },
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Labor Attendance Trends</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={e => setTimeRange(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="lastWeek">Last Week</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="allTime">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {loading ? (
          <Typography>Loading attendance data...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={options} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceLineGraph;
