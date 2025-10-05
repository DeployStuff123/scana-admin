import { Box, Stack, Typography, Paper, Divider, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Button, Avatar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import apiReq from '../../../utils/axiosReq';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit as EditIcon, Link as LinkIcon, Email as EmailIcon, Visibility as VisibilityIcon, ArrowBack, Download as DownloadIcon, ContentCopy, Google, EmailOutlined, CallMade } from '@mui/icons-material';
import { format } from 'date-fns';
import Loader from '../../common/Loader';
import { DataGrid } from '@mui/x-data-grid';
import DataTable from '../../common/DataTable';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import useAuth from '../../hook/useAuth';
import { useTranslation } from 'react-i18next';


const RedirectLinkDetails = () => {
  const { slug } = useParams();
  const [filters, setFilters] = useState({ from: '', to: '' });
  const navigate = useNavigate();

  const { t } = useTranslation('redirectLinkDetails')

  const { token } = useAuth();
  const queryUrl = `api/link/details/${slug}?from=${filters.from}&to=${filters.to}`;

  const { data, isLoading } = useQuery({
    queryFn: async () => await apiReq.get(queryUrl, { headers: { Authorization: token } }),
    queryKey: ['link', slug, filters]
  });

  const handleExport = async () => {
    const response = await apiReq.get(
      `api/link/details/${slug}?from=${filters.from}&to=${filters.to}&exportAs=csv`,
      { responseType: 'blob', headers: { Authorization: token } }
    );
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug}_visits.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  const emailList = data?.data?.emailList || [];

  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'email', headerName: 'Email', width: 300 },
    {
      field: 'followUp',
      headerName: 'followUp',
      width: 200,
      renderCell: (params) => (
        <Stack height="100%" justifyContent="center">
          <Typography sx={{
            bgcolor: params.row.followUpSent ? 'green' : 'darkgray',
            color: '#fff',
            px: 1, borderRadius: 2,
            width: 'fit-content'
          }} variant="body2" color="text.secondary">
            {params.row?.followUpSent ? 'send' : 'pending'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'visitedAt',
      headerName: 'Visits',
      width: 200,
      renderCell: (params) => (
        <Stack height="100%" justifyContent="center">
          <Typography variant="body2" color="text.secondary">
            {params.row.visitedAt ? format(params.row.visitedAt, 'dd MMM yyyy') : 'N/A'}
          </Typography>
          <Typography sx={{ fontSize: '11px' }} color="text.secondary">
            {params.row.visitedAt ? format(params.row.visitedAt, ' hh:mm a') : 'N/A'}
          </Typography>
        </Stack>
      )
    }
  ];

  const rows = emailList.map((item, index) => ({
    id: index + 1,
    email: item.email,
    visitedAt: item.visitedAt,
    followUpSent: item.followUpSent
  }));

  console.log(data)

  return (
    <Box sx={{ bgcolor: '#fff', p: { xs: 2, md: 4 }, borderRadius: '24px', minHeight: '100vh', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} maxWidth='lg'>

      {isLoading ? <Loader /> :

        <Stack spacing={7}>
          <Box >
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBack />
              </IconButton>
              {/* <LinkIcon sx={{ color: '#1976d2' }} /> */}
              <Typography variant="h6" fontWeight="500">{t('link_information')}</Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Stack direction={{ xs: 'column', md: 'row' }} gap={4} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={3}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography fontWeight="600" color="text.secondary" mb={1}>Slug</Typography>
                  <Chip label={data?.data?.slug} sx={{ fontSize: '1rem', py: 2 }} />
                  <IconButton onClick={() => copyToClipboard(data?.data?.slug)}>
                    <ContentCopy fontSize='small' />
                  </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography sx={{ minWidth: '150px' }} fontWeight="600" color="text.secondary" mb={1}>Created At : </Typography>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>{data?.data?.createdAt ? format(data?.data?.createdAt, 'dd MMM yyyy') : 'N/A'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography sx={{ minWidth: '150px' }} fontWeight="600" color="text.secondary" mb={1}>Google Login : </Typography>

                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: .5,
                      bgcolor: data?.data?.googleLogin === 'active' ? 'green' : data?.data?.googleLogin === 'optional' ? 'orange' : 'darkgray',
                      fontSize: '14px',
                      width: 'fit-content',
                      color: 'white',
                      borderRadius: '50px',
                      px: 1,
                      py: 0.2
                    }}>
                    <Google sx={{ fontSize: '14px' }} /> {data?.data?.googleLogin}
                  </Typography>

                </Stack>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Typography sx={{ minWidth: '150px' }} fontWeight='600' color='text.secondary'>Status : </Typography>
                  <Typography
                    sx={{
                      bgcolor: data?.data?.isActive ? 'green' : 'darkgray',
                      color: 'white',
                      width: '100px',
                      textAlign: 'center',
                      fontSize: '14px',
                      borderRadius: 1,
                      fontWeight: 'medium',
                      px: 1,
                      py: 0.3,
                    }}
                  >
                    {data?.data?.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Stack>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Typography sx={{ minWidth: '150px' }} fontWeight='600' color='text.secondary'>Type : </Typography>
                  <Typography>{data?.data?.type}</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Typography sx={{ minWidth: '150px' }} fontWeight='600' color='text.secondary'>Description : </Typography>
                  <Typography>{data?.data?.description}</Typography>
                </Stack>

              </Stack>

              <Box>
                <Stack direction='row' alignItems="center" gap={2}>
                  <Avatar
                    src={data?.data?.user?.img}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box >
                    <Stack gap={1}>
                      <Typography variant="h5" >{data?.data?.user?.name}</Typography>
                      <Link to={`/dashboard/users/${data?.data?.user?.username}`} style={{ textDecoration: 'none', color: '#1976d2' }}>@ {data?.data?.user?.username}</Link>
                      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailOutlined /> {data?.data?.user?.email}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Typography variant="subtitle2" color="text.secondary" mt={4} mb={1}>Destination URL</Typography>
                <a
                  href={data?.data?.destinationUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: '#1976d2', wordBreak: 'break-all' }}
                >
                  {data?.data?.destinationUrl}
                </a>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <VisibilityIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" fontWeight="500">{t('analytics')}</Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flex={1} sx={{ py: 2, px: 4, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                <Typography variant="h5" color="text.secondary">{t('total_visits')}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }} variant="h4" fontWeight="bold" color="#1976d2">
                  {data?.data?.visits || 0}
                  <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboard/redirect-links/visits/${data?.data?._id}`}>
                    <CallMade />
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" flex={1} sx={{ py: 2, px: 4, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                <Typography variant="h5" color="text.secondary">{t('emails')}</Typography>
                <Typography variant="h4" fontWeight="bold" color="#1976d2">
                  {emailList?.length}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} mt={4}>
              <TextField
                size="small"
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={filters.from}
                onChange={e => setFilters({ ...filters, from: e.target.value })}
              />
              <TextField
                size="small"
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={filters.to}
                onChange={e => setFilters({ ...filters, to: e.target.value })}
              />
              {
                (filters.from || filters.to) &&
                <Button variant="" size="small" onClick={() => setFilters({ from: '', to: '' })}>Reset</Button>
              }
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <EmailIcon sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight="500">{t('email_collection')}</Typography>
              </Stack>
              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExport}>Export CSV</Button>

            </Stack>
            <Divider sx={{ mb: 3 }} />



            <DataTable
              rows={rows || []}
              columns={columns}
            />

          </Box>
        </Stack>
      }

    </Box>
  );
};

export default RedirectLinkDetails;
