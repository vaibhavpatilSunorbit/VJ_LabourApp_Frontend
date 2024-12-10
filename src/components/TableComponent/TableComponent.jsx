import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

/**
 * DataGridDemo Component
 * Displays a free Material-UI data grid with demo data.
 */
export default function DataGridDemo() {
  // Fetch demo data for the DataGrid
  const { data, loading } = useDemoData({
    dataSet: 'Commodity', // Data set type ('Commodity', 'Employee', etc.)
    rowLength: 1000, // Number of rows in the dataset
    editable: true, // Makes the cells editable
  });

  return (
    <Box sx={{ height: 1000, width: '100%' }}>
      <DataGrid
        {...data} // Spread demo data props
        loading={loading} // Shows a loading spinner while data is being fetched
        rowHeight={38} // Sets the height of each row
        checkboxSelection // Enables checkboxes for row selection
        disableRowSelectionOnClick // Prevents row selection on click
        pagination // Enables pagination for better performance
      />
    </Box>
  );
}
