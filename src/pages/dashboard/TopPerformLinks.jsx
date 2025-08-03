import { Box, Typography } from '@mui/material';
import React from 'react'
import DataTable from '../../common/DataTable';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const TopPerformLinks = ({ data }) => {
  const topLinksColumns = [
    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
      renderCell: (params) => (
        <Link
          to={`redirect-links/${params.value}`}
          style={{
            textDecoration: 'none',
            color: '#1976d2',
            fontWeight: 500
          }}
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'destinationUrl',
      headerName: 'Destination',
      width: 200,
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.value}
        </div>
      )
    },
    {
      field: 'visits',
      headerName: 'Visits',
      width: 200,
      align: 'right',
      headerAlign: 'right'
    }
  ];
  return (
    <Box mb={6}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Top Performing Links
      </Typography>
      <DataGrid
        rows={data || []}
        columns={topLinksColumns}
        getRowId={(row) => row._id}
        disableRowSelectionOnClick
        hideFooter
      />
    </Box>
  )
}

export default TopPerformLinks