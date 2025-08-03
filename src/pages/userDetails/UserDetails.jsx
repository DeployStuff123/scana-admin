import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import apiReq from '../../../utils/axiosReq';
import { Avatar, Box, Card, CardContent, Grid, Stack, Typography, IconButton, Divider } from '@mui/material';
import { format } from 'date-fns';
import { ArrowBack, EmailOutlined, Person2Outlined } from '@mui/icons-material';
import DataTable from '../../common/DataTable';
import Loader from '../../common/Loader';
import { useTranslation } from 'react-i18next';

const UserDetails = () => {
  const { username } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const { t } = useTranslation('userDetails')

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get(`api/user/details/${username}`, { headers: { Authorization: token } }),
    queryKey: ['user', username]
  });

  const columns = [
    {
      field: 'slug',
      headerName: 'Slug',
      width: 150,
      renderCell: (params) => (
        <Stack height='100%' direction='row' alignItems='center' gap={1}>
          <Link to={`/dashboard/redirect-links/${params.row.slug}`}>
            {params.row.slug}
          </Link>
        </Stack>
      )
    },
    {
      field: 'destinationUrl',
      headerName: 'Destination URL',
      width: 250,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
    },

    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Stack height='100%' direction='row' alignItems='center' gap={1}>
          <Typography color={params.row.isActive ? 'success.main' : 'error.main'}>
            {params.row.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      renderCell: (params) => format(new Date(params.row.createdAt), 'PPpp')
    }
  ];

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading user details</div>;

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: { xs: 2, md: 3 }, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        {/* <LinkIcon sx={{ color: '#1976d2' }} /> */}
        <Typography variant="h6" fontWeight="500">{t('user_info')}</Typography>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Box p={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  src={data?.data?.img}
                  sx={{ width: 150, height: 150 }}
                />
                <Typography variant="h6">@{data?.data?.username}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={9}>
              <Stack spacing={2}>
                <Typography variant="h5" gutterBottom>{data?.data?.name}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlined /> {data?.data?.email}
                </Typography>
                <Typography>
                  Member since: {format(new Date(data?.data?.createdAt), 'PPP')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>{t('redirect_links')}</Typography>
      <DataTable
        rows={data?.data?.links || []}
        getRowId={(row) => row._id}
        columns={columns}
        loading={isLoading}
      />
    </Box>
  )
}

export default UserDetails