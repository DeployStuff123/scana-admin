import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import DataTable from '../../common/DataTable'
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';

const RecentEmail = ({ data }) => {
  const emailsColumns = [

    {
      field: 'link',
      headerName: 'Link',
      width: 200,
      renderCell: (params) => (
        <Link
          to={`redirect-links/${params?.value?.slug}`}
          style={{
            textDecoration: 'none',
            color: '#1976d2',
            fontWeight: 500
          }}
        >
          {params?.value?.slug}
        </Link>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300
    },
    {
      field: 'visitedAt',
      headerName: 'Captured At',
      width: 200,
      renderCell: (params) => (
        <Stack height="100%" justifyContent="center">
          <Typography variant="body2" color="text.secondary">
            {format(params.row.visitedAt, 'dd MMM yyyy')}
          </Typography>
          <Typography sx={{ fontSize: '12px' }} color="text.secondary">
            {format(params.row.visitedAt, ' hh:mm a')}
          </Typography>
        </Stack>
      )
    }
  ];
  return (
    <Box >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Recent Email Captures
      </Typography>
      <DataGrid
        rows={data || []}
        columns={emailsColumns}
        getRowId={(row) => row._id}
        hideFooter
      />
    </Box>
  )
}

export default RecentEmail