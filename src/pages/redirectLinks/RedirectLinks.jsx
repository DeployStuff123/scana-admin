import { Avatar, Box, DialogActions, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import apiReq from '../../../utils/axiosReq';
import { AccessTime, AddToHomeScreen, CallMade, CheckCircle, ContentCopy, DeleteOutlined, EditOutlined, EmailOutlined, Google, InsertLink, LinkOff, QrCode, SearchOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DataTable from '../../common/DataTable';
import CDialog from '../../common/CDialog';
import CButton from '../../common/CButton';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import useAuth from '../../hook/useAuth';
import { format } from 'date-fns';
import UpdateLink from './UpdateLink';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';


const RedirectLinks = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLinkData, setEditLinkData] = useState(null);
  const [deleteLinkData, setDeleteLinkData] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const { token } = useAuth();

  const { t } = useTranslation('redirectLinks')

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get(`api/link/all?status=${status}&search=${search}`, { headers: { Authorization: token } }),
    queryKey: ['links', status, search]
  });
  console.log(data);
  const queryClient = useQueryClient();

  const deleteLinkMutation = useMutation({
    mutationFn: (id) => apiReq.delete(`api/link/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data.message);
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

  const downloadQrCode = async (slug) => {
    const qrCode = await QRCode.toDataURL(`https://scanaqr.com/${slug}`);
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${slug}.png`;
    toast.success('QR Code downloaded successfully');
    link.click();
  }


  const columns = [

    {
      field: 'slug',
      headerName: 'Slug',
      width: 170,
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
      field: 'user',
      headerName: 'User',
      width: 200,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          {
            params.row?.user ?
              <Stack direction='row' gap={1} alignItems='center' height='100%'>
                <Avatar src={params.row.user?.img} sx={{ width: '30px', height: '30px' }} />
                <Box>
                  <Link to={`/dashboard/users/${params.row.user?.username}`} style={{ textDecoration: 'none' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>@ {params.row.user?.username}</Typography>
                  </Link>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: .5 }}> {params.row.user?.name}</Typography>
                </Box>
              </Stack>
              :
              <Typography sx={{ color: 'red' }}>Removed</Typography>
          }
        </Stack>
      ),
    },

    {
      field: 'counts',
      headerName: 'Counts/Type',
      width: 200,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <Stack direction='row' gap={4}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailOutlined sx={{ fontSize: '20px', color: 'gray' }} />
              {params.row.emailCount}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityOutlined sx={{ fontSize: '20px', color: 'gray' }} />
              {params.row.visits}
              <Link to={`visits/${params.row._id}`}>
                <CallMade sx={{ fontSize: '14px' }} />
              </Link>
            </Typography>
          </Stack>
          {
            params.row.type !== 'none' &&
            <Typography sx={{ color: 'darkcyan' }}>{params.row.type}</Typography>
          }
        </Stack>
      ),
    },
    {
      field: 'Info',
      headerName: 'Info',
      width: 250,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' gap={1.5} height='100%'>
          {params.row.image ? (
            <img src={params.row.image} alt={params.row.slug} style={{ width: '30px', height: '40px' }} />
          ) :
            <AddToHomeScreen sx={{ color: 'gray' }} />
          }
          <Stack justifyContent="center" height='100%'>
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
              <AccessTime sx={{ fontSize: '18px', color: 'grays' }} />
              {format(params.row.createdAt, 'dd/MM/yyyy')}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <a href={params.row.destinationUrl} target='_blank' rel='noreferrer'>{params.row.destinationUrl}</a>
            </Typography>
          </Stack>
        </Stack>
      ),
    },

    {
      field: 'status',
      headerName: 'Link Status',
      width: 150,
      renderCell: (params) => (
        <Stack height='100%' gap={.5} justifyContent='center'>
          <Typography
            sx={{
              bgcolor: params.row.isActive ? 'blue' : 'darkgray',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: .5,
              width: 'fit-content',
              textAlign: 'center',
              fontSize: '12px',
              borderRadius: 1,
              fontWeight: 'medium',
              px: 1,
              py: 0.1,
            }}
          >
            {params.row.isActive ? <InsertLink sx={{ fontSize: '20px' }} /> : <LinkOff sx={{ fontSize: '20px' }} />}
            {params.row.isActive ? 'Active' : 'Inactive'}
          </Typography>

          <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            gap: .5,
            bgcolor: params.row.googleLogin === 'active' ? 'green' : params.row.googleLogin === 'optional' ? 'orange' : 'darkgray',
            fontSize: '12px',
            width: 'fit-content',
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.2
          }}> <Google sx={{ fontSize: '14px' }} /> {params.row.googleLogin}</Typography>

        </Stack>
      ),
    },

    {
      field: 'options',
      headerName: '',
      width: 150,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => downloadQrCode(params.row.slug)}>
            <QrCode fontSize='small' />
          </IconButton>
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
      p: { xs: 2, md: 3 }, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Stack mb={4} direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h5" gutterBottom>
          {t('redirect_links')} <span style={{ fontSize: '14px', color: 'gray' }}>({data?.data?.length})</span>
        </Typography>
        {/* <CButton variant='contained' color='primary' onClick={() => setCreateLinkDialogOpen(true)}>Create Link</CButton> */}
      </Stack>


      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <TextField
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          placeholder='slug / user'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select sx={{ minWidth: '200px' }} size='small' value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value='all'>All</MenuItem>
          <MenuItem value='active'>Active</MenuItem>
          <MenuItem value='inactive'>Inactive</MenuItem>
        </Select>
      </Stack>
      <Box mt={4}>
        <DataTable
          rows={data?.data || []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          rowHeight={70}
          noRowsLabel="No Links Available"
        />

      </Box>

      {/* delete dialog */}
      <CDialog title={t('delete_link')} open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Typography>{t('delete_desc')} <b>{deleteLinkData?.slug}</b> ?</Typography>
        <Typography color='error'>{t('delete_desc2')}</Typography>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton variant='contained' loading={deleteLinkMutation.isPending} onClick={handleDelete} color="error">Delete</CButton>
        </DialogActions>
      </CDialog>

      {/* <CDialog disableOutsideClick closeButton title='Create Link' open={createLinkDialogOpen} onClose={() => setCreateLinkDialogOpen(false)}>
        <CreateLink closeDialog={() => setCreateLinkDialogOpen(false)} />
      </CDialog> */}


      <CDialog closeButton title={t('update_link')} open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <UpdateLink linkData={editLinkData} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>

    </Box>
  )
}

export default RedirectLinks