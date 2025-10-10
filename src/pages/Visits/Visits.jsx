import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import apiReq from '../../../utils/axiosReq';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Box, Stack, Typography, Divider, Chip, IconButton, Button, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, VisibilityOutlined } from '@mui/icons-material';
import CDialog from '../../common/CDialog';
import DataTable from '../../common/DataTable';
import CButton from '../../common/CButton';
import toast from 'react-hot-toast';

const Visits = () => {
  const navigate = useNavigate();
  const { linkId } = useParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const { t } = useTranslation('visits');
  const { data, isLoading } = useQuery({
    queryFn: async () => await apiReq.get(`api/visit/get/${linkId}`, {
    }),
    queryKey: ['visits', linkId]
  });

  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: () =>
      apiReq.post('api/visit/delete', {
        visitIds: selectedIds,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setSelectedIds([]);
      setRemoveDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['visits', linkId] });
    }
  });

  const rows = useMemo(() => data?.data || [], [data?.data]);


  const columns = useMemo(() => ([
    {
      field: 'visitorId',
      headerName: 'Visitor ID', width: 200,
      renderCell: (params) => (
        <Stack height="100%" justifyContent="center">
          <Typography>{params.row.visitorId.split('-')[0]}</Typography>
        </Stack>
      )
    },
    // {
    //   field: 'visitIp',
    //   headerName: 'Visitor IP', width: 200,
    //   renderCell: (params) => (
    //     <Stack height="100%" justifyContent="center">
    //       <Typography>{params.row.visitIp}</Typography>
    //     </Stack>
    //   )
    // },
    {
      field: 'visitedAt',
      headerName: 'Visited At', width: 200,
      renderCell: (params) => (
        <Stack height="100%" justifyContent="center">
          <Typography>{params.row.visitedAt ? format(params.row.visitedAt, 'dd MMM yyyy') : 'N/A'}</Typography>
          <Typography sx={{ fontSize: '11px' }}>
            {params.row.visitedAt ? format(params.row.visitedAt, ' hh:mm:ss a') : 'N/A'}
          </Typography>
        </Stack>
      )
    }
  ]), [t]);


  return (
    <Box sx={{ bgcolor: '#fff', p: { xs: 2, md: 4 }, borderRadius: 3, minHeight: '100vh', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      {/* Animated Summary Header */}

      <Stack spacing={4}>
        {/* Header section */}
        <Stack direction="row" alignItems="center" >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Back</Typography>
        </Stack>
        {
          data?.data[0]?.link &&
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            bgcolor: '#e3f2fd',
            borderRadius: 2,
            p: 2,
            fontWeight: '600',
            textAlign: 'center',
            width: 'fit-content'
          }}>
            <Typography variant="h6">Link : <span style={{ fontWeight: '600' }}>{data?.data[0]?.link?.slug}</span></Typography>
          </Box>
        }
        <Divider />
      </Stack>


      <Box mt={5}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <VisibilityOutlined color="primary" />
            <Typography variant="h6">Visits ({rows.length})</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            {selectedIds.length > 0 && (

              <Button size="small" color="error" variant="contained" onClick={() => setRemoveDialogOpen(true)}>Remove</Button>

            )}

          </Stack>
        </Stack>

        {/* Dialogs */}

        <CDialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)} title="Remove">
          <Typography>Are you sure you want to remove selected visits?</Typography>
          <DialogActions>
            <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
            <CButton variant="contained" color="error" loading={removeMutation.isPending} onClick={removeMutation.mutate}>
              Remove
            </CButton>
          </DialogActions>
        </CDialog>

        {/* DataTable */}
        <DataTable
          rows={rows}
          columns={columns}
          checkboxSelection
          loading={isLoading}
          getRowId={(row) => row._id}
          noRowsLabel='No visits found'
          onRowSelectionModelChange={(ids) =>
            setSelectedIds(rows.filter(r => ids.includes(r._id)).map(r => r._id))
          }
        />
      </Box>
    </Box>
  )
}

export default Visits