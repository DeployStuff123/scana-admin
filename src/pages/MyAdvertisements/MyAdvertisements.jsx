import { Box, DialogActions, IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import apiReq from '../../../utils/axiosReq';
import { CheckCircle, ContentCopy, DeleteOutlined, EditOutlined, EmailOutlined, Google, VisibilityOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DataTable from '../../common/DataTable';
import CDialog from '../../common/CDialog';
import CButton from '../../common/CButton';
import UpdateAd from './UpdateAd';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../../../utils/copyToClipboard';

const MyAdvertisements = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLinkData, setEditLinkData] = useState(null);
  const [deleteLinkData, setDeleteLinkData] = useState(null);


  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get('api/links'),
    queryKey: ['links']
  });
  console.log(data);
  const queryClient = useQueryClient();

  const deleteLinkMutation = useMutation({
    mutationFn: (id) => apiReq.delete(`api/links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['links']);
    }
  });

  const handleEdit = (row) => {
    setEditDialogOpen(true);
    setEditLinkData(row);
  }

  const handleDeleteDialog = (data) => {
    setDeleteDialogOpen(true);
    setDeleteLinkData(data);
  }

  const handleDelete = () => {
    deleteLinkMutation.mutate(deleteLinkData._id);
    setDeleteDialogOpen(false);
  }

  const columns = [

    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => copyToClipboard(params.row.slug)}>
            <ContentCopy fontSize='small' />
          </IconButton>
          <Link to={`${params.row.slug}`} style={{ textDecoration: 'none' }}>
            <Typography>{params.row.slug}</Typography>
          </Link>
        </Stack>
      ),
    },

    {
      field: 'googleLogin',
      headerName: 'Google Login',
      width: 150,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          {params.row.googleLogin ?
            <Typography sx={{display: 'flex', alignItems: 'center', gap: .5, bgcolor: 'green', fontSize: '14px', width: 'fit-content', color: 'white', borderRadius: '50px', px: 1, py: 0.2}}> <Google sx={{fontSize: '14px'}} /> Active</Typography> :
            <Typography sx={{display: 'flex', alignItems: 'center', gap: .5, bgcolor: 'darkgray', fontSize: '14px', width: 'fit-content', color: 'white', borderRadius: '50px', px: 1, py: 0.2 }}> <Google sx={{fontSize: '14px'}} /> Inactive</Typography>
          }

        </Stack>
      ),
    },
    {
      field: 'totalEmails',
      headerName: 'Total Emails',
      width: 150,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailOutlined sx={{ fontSize: '20px', color: 'primary.main' }} />
            {params.row.emailCount}
          </Typography>
        </Stack>
      ),
    },

    {
      field: 'visits',
      headerName: 'Visits',
      width: 150,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityOutlined sx={{ fontSize: '20px', color: 'primary.main' }} />
            {params.row.visits}
          </Typography>
        </Stack>
      ),
    },

    {
      field: 'destinationUrl',
      headerName: 'Destination URL',
      width: 300,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <a href={params.row.destinationUrl} target='_blank' rel='noreferrer'>{params.row.destinationUrl}</a>
        </Stack>
      ),
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 200,
    //   renderCell: (params) => (
    //     <Stack height='100%' justifyContent='center'>
    //       <Typography
    //         sx={{
    //           bgcolor: {
    //             pending: 'orange',
    //             upcoming: 'purple',
    //             running: 'steelblue',
    //             completed: 'green',
    //             inactive: 'darkgray'
    //           }[params.row.status],
    //           color: 'white',
    //           width: '120px',
    //           textAlign: 'center',
    //           borderRadius: 1,
    //           fontWeight: 'medium',
    //           px: 1,
    //           py: 0.5,
    //         }}
    //       >
    //         {params.row.status}
    //       </Typography>
    //     </Stack>
    //   ),
    // },

    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => handleEdit(params.row)} >
            <EditOutlined fontSize='small' />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialog(params.row)} >
            <DeleteOutlined fontSize='small' />
          </IconButton>
        </Stack>
      ),
    },
  ];


  return (
    <Box sx={{
      bgcolor: '#fff',
      p: {xs:2,md:3}, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Typography variant="h5" gutterBottom>
        My Advertisements
      </Typography>


      <Box  mt={4}>
        <DataTable
          rows={data?.data || []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          rowHeight={70}
          noRowsLabel="No Advertisements Available"
        />

      </Box>

      {/* delete dialog */}
      <CDialog title='Delete Link' open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Typography>Are you sure you want to delete <b>{deleteLinkData?.slug}</b> ?</Typography>
        <Typography color='error'>It also delete all the emails collected with this link</Typography>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton variant='contained' loading={deleteLinkMutation.isPending} onClick={handleDelete} color="error">Delete</CButton>
        </DialogActions>
      </CDialog>

      {/* edit dialog */}
      <CDialog closeButton title='Edit Link' open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <UpdateAd linkData={editLinkData} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>

    </Box>
  )
}

export default MyAdvertisements