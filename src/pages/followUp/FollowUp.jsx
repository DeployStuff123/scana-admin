import { Avatar, Box, Chip, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import CDialog from '../../common/CDialog';
import { useQuery } from '@tanstack/react-query';
import apiReq from '../../../utils/axiosReq';
import useAuth from '../../hook/useAuth';
import { DeleteOutline, Edit, Email, SearchOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import DataTable from '../../common/DataTable';
import { Link } from 'react-router-dom';
import DeleteFollowup from './DeleteFollowup';
import FollowUpForm from './FollowUpForm';
import { useTranslation } from 'react-i18next';

const FollowUp = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const { token } = useAuth()
  const { t } = useTranslation('followUp')

  const { data, isLoading } = useQuery({
    queryFn: async () => await apiReq.get(`api/follow-up/all?status=${status}&slug=${search}`, { headers: { Authorization: token } }),
    queryKey: ['follow-ups', status, search]
  });


  const handleEdit = (data) => {
    setEditDialogOpen(true)
    setEditData(data)
  };

  const handleDelete = (data) => {
    setDeleteDialogOpen(true)
    setDeleteData(data)
  };

  const columns = [
    {
      field: 'user',
      headerName: 'User',
      width: 250,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          <Avatar src={params.row?.user?.img} />
          <Box>
            <Link to={`/dashboard/users/${params.row?.user?.username}`} style={{ textDecoration: 'none' }}>
              <Typography variant='body2' fontWeight={600}>@{params.row?.user?.username}</Typography>
            </Link>
            <Typography sx={{ fontSize: '12px' }}>{params.row?.user?.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'slug',
      headerName: 'Slug',
      width: 170,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          {
            params.row.img && (
              <img style={{ width: '30px', height: '50px', }} src={params.row.img} />
            )
          }
          <Link to={`/dashboard/redirect-links/${params.row.link?.slug}`} style={{ textDecoration: 'none' }}>
            <Typography>{params.row.link?.slug}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      field: 'subject', headerName: 'Subject / Image', width: 200, renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          {params.row.img && (
            <img style={{ width: '30px', height: '50px', }} src={params.row.img} />
          )}
          <Typography>{params.row.subject}</Typography>
        </Stack>
      )
    },
    {
      field: 'destinationUrl', headerName: 'Destination URL', width: 250,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          <a href={params.row.destinationUrl} style={{ textDecoration: 'none' }}>
            <Typography>{params.row.destinationUrl}</Typography>
          </a>
        </Stack>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Stack height='100%' gap={.5} justifyContent='center'>
          <Chip label={params.row.enabled ? 'Active' : 'Inactive'} sx={{ bgcolor: params.row.enabled ? 'green' : 'darkgray', color: 'white', fontSize: '12px', width: 'fit-content', borderRadius: 1, px: 1, }} size='small' />
          <Chip label={params.row.approved ? 'Approved' : 'Pending'} sx={{ bgcolor: params.row.approved ? 'green' : 'tomato', color: 'white', fontSize: '12px', width: 'fit-content', borderRadius: 1, px: 1, }} size='small' />

        </Stack>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row)}>
              <Edit fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteOutline fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: { xs: 2, md: 3 },
      borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Stack direction='row' justifyContent='space-between' gap={2} alignItems='center' mb={4}>
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}>
            {t('follow_up')} <span style={{ fontSize: '12px', color: 'text.secondary' }}>({data?.data?.length})</span>
          </Typography>
        </Box>
        {/* <CButton variant='contained' color='primary' onClick={() => setFollowUpDialogOpen(true)}>Create Follow-up</CButton> */}
      </Stack>

      <Stack mb={2} direction='row' justifyContent='space-between' alignItems='center'>
        <TextField
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          placeholder='Search by slug'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select sx={{ minWidth: '200px' }} size='small' value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value='all'>All</MenuItem>
          <MenuItem value='active'>Active</MenuItem>
          <MenuItem value='inactive'>Inactive</MenuItem>
        </Select>
      </Stack>

      <Box sx={{ height: 400, width: '100%' }}>
        {data?.data && (
          <DataTable
            rowHeight={70}
            rows={data.data}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isLoading}
          />
        )}

      </Box>

      {/* edit follow-up email dialog */}
      <CDialog disableOutsideClick closeButton title={t('update_follow_up')} open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <FollowUpForm closeDialog={() => setEditDialogOpen(false)} editData={editData} />
      </CDialog>

      {/* delete follow-up email dialog */}
      <CDialog closeButton title={t('delete_follow_up')} open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DeleteFollowup closeDialog={() => setDeleteDialogOpen(false)} data={deleteData} />
      </CDialog>

    </Box>
  )
}

export default FollowUp