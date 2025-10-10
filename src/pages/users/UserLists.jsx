import { Avatar, Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import DataTable from '../../common/DataTable'
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, InsertLink, SearchOutlined } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiReq from '../../../utils/axiosReq';
import CButton from '../../common/CButton';
import CDialog from '../../common/CDialog';
import AddUser from './AddUser';
import EditUser from './EditUser';
import useAuth from '../../hook/useAuth';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';




const UserLists = () => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [status, setStatus] = useState('')

  const { token } = useAuth();

  const { t } = useTranslation('userList');

  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => apiReq.get('/api/user/all-users', { params: { search }, headers: { Authorization: token } }),
  })

  const queryClient = useQueryClient()

  const statusChangeMutation = useMutation({
    mutationFn: (data) => apiReq.put('/api/user/admin/status', data, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(res.data.message)
      setStatus('')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleEdit = (row) => {
    setEditDialogOpen(true)
    setEditUser(row)
  }

  const handleStatusChange = () => {
    if (status === '') {
      toast.error('Please select status')
      return
    }
    statusChangeMutation.mutate({
      status,
      userIds: selectedIds
    })
  }


  const columns = [

    {
      field: 'user',
      headerName: 'User',
      width: 250,
      renderCell: (params) => (
        <Stack gap={1} direction='row' alignItems='center' height='100%'>
          <Avatar src={params.row?.img} />
          <Box>
            <Link to={`${params.row?.username}`} style={{ textDecoration: 'none' }}>
              <Typography>@{params.row?.username}</Typography>
            </Link>
            <Typography>{params.row?.name}</Typography>
          </Box>
        </Stack>
      ),
    },

    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <Typography>{params.row?.email}</Typography>
        </Stack>
      ),
    },


    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => (
        <Stack height='100%' justifyContent='center'>
          <Typography
            sx={{
              bgcolor: params.row.isBlocked ? 'error.main' : 'success.main',
              color: 'white',
              width: '100px',
              textAlign: 'center',
              borderRadius: 1,
              fontSize: '14px',
              px: 1,

            }}
          >
            {params.row.isBlocked ? 'Blocked' : 'Active'}
          </Typography>
        </Stack>
      ),
    },

    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => handleEdit(params.row)} >
            <EditOutlined fontSize='small' />
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
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {t('user_lists')} <span style={{ fontSize: '14px', fontWeight: '300' }}>({data?.data?.length})</span>
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          {
            selectedIds.length > 0 &&
            <Stack direction='row' gap={1} alignItems='center'>
              <FormControl size='small' sx={{ width: '150px' }}>
                <InputLabel>Status</InputLabel>
                <Select label='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='blocked'>Blocked</MenuItem>
                </Select>
              </FormControl>
              <CButton onClick={handleStatusChange} variant='contained'>Apply</CButton>
            </Stack>
          }
          <TextField
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            placeholder='username / email'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CButton variant='contained' color='primary' onClick={() => setAddUserDialogOpen(true)}>{t('add_user')}</CButton>
        </Stack>
      </Stack>




      <Box mt={4}>
        <DataTable
          rows={data?.data || []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          checkboxSelection
          rowHeight={70}
          noRowsLabel={t('no_user_available')}
          onRowSelectionModelChange={(ids) =>
            setSelectedIds(ids)
          }
        />
      </Box>

      {/* add user dialog */}
      <CDialog closeButton title={t('add_user')} open={addUserDialogOpen} onClose={() => setAddUserDialogOpen(false)}>
        <AddUser closeDialog={() => setAddUserDialogOpen(false)} />
      </CDialog>

      {/* edit dialog */}
      <CDialog closeButton title={t('edit_user')} open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditUser userData={editUser} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>

    </Box >
  )
}

export default UserLists