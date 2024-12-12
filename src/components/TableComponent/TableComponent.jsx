import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const TableComponent = ({ rows, columns, loading, onRowClick }) => {
  return (
    <Box sx={{ height: 1000, width: '84vw' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      onRowClick={onRowClick}
      getRowId={(row) => row.id || row.LabourID} // Unique row identification
      loading={loading}
      rowHeight={60} // Correct dynamic row height
      checkboxSelection
      disableRowSelectionOnClick
      pagination
      pageSizeOptions={[10, 50, 100]}
      sx={{
        height: '630.5px',
        boxShadow: 5,
        fontWeight: '400',
        cursor: 'pointer',
        '& .MuiDataGrid-row:hover': {
          background:
            'linear-gradient(90deg, rgba(255, 237, 226, 0.5) 0%, #FFEDE2 100%)',
        },
      }}
    />
  </Box>
  );
};

export default TableComponent;
