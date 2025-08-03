/* eslint-disable react/prop-types */
import { Alert, Box, Button, CircularProgress, FormControlLabel, FormGroup, Switch, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import apiReq from '../../../utils/axiosReq';
import CButton from '../../common/CButton';

const UpdateAd = ({ linkData, closeDialog }) => {
  const [customName, setCustomName] = useState(linkData?.slug || '');
  const [destinationUrl, setDestinationUrl] = useState(linkData?.destinationUrl || '');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [googleLogin, setGoogleLogin] = useState(linkData?.googleLogin || false);

  const queryClient = useQueryClient();
  console.log(linkData);
  const updateLinkMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiReq.put(`api/links/${linkData._id}`, data);
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(['links']);
      toast.success(res);
      closeDialog();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customName || !destinationUrl) {
      setError('Please fill in all fields.');
      return;
    }
    setSuccessMessage('');
    setError('');

    updateLinkMutation.mutate({
      slug: customName,
      destinationUrl: destinationUrl,
      googleLogin: googleLogin
    });
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Slug Name"
          placeholder="e.g. advertisement1"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Destination URL"
          placeholder="e.g. https://client-site.com"
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          margin="normal"
          required
        />
        <FormGroup>
          <FormControlLabel control={<Switch checked={googleLogin} onChange={(e) => setGoogleLogin(e.target.checked)} />} label="Google Login" />
        </FormGroup>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CButton loading={updateLinkMutation.isPending} fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
            Update Link
          </CButton>
        )}
      </Box>
    </Box>
  );
};

export default UpdateAd;