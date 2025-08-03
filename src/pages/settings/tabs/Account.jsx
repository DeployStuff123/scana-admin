import { KeyboardArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, Input, InputAdornment, InputLabel, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiReq from '../../../../utils/axiosReq';
import CButton from '../../../common/CButton';
import useAuth from '../../../hook/useAuth';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErr, setPasswordErr] = useState(null);
  const [editOn, setEditOn] = useState(false)
  const [payload, setPayload] = useState({
    currentPass: '',
    newPass: '',
    repeatPass: ''
  })

  const { token } = useAuth();
  const { t } = useTranslation('setting')

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const mutation = useMutation({
    mutationFn: (input) => apiReq.put('api/user/change-password', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      setEditOn(false)
      setPayload({
        currentPass: '',
        newPass: '',
        repeatPass: ''
      })
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleUpdate = () => {
    if (!payload.currentPass) {
      toast.error('Current password required!')
      return
    }
    if (!payload.newPass) {
      toast.error('New password empty!')
      return
    }
    if (!payload.repeatPass) {
      toast.error('Repeat password empty!')
      return
    }
    if (payload.newPass !== payload.repeatPass) {
      setPasswordErr('Password not match!')
      return;
    } else {
      setPasswordErr(null)
    }

    mutation.mutate({
      currentPassword: payload.currentPass,
      newPassword: payload.newPass
    });
  }

  return (
    <Stack>
      <Typography variant='h5' mb={1}>{t('account')}</Typography>
      <Stack>
        <InputLabel sx={{ mt: 3 }}>Current password</InputLabel>
        <Input disabled={!editOn} name='currentPass' value={payload.currentPass} onChange={handleInputChange} variant='standard' />
        <InputLabel sx={{ mt: 3 }}>New Password</InputLabel>
        <Input
          disabled={!editOn}
          type={showPassword ? 'text' : 'password'}
          variant='standard'
          name='newPass'
          value={payload.newPass}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <InputLabel sx={{ mt: 3 }}>Repeat Password</InputLabel>
        <Input
          disabled={!editOn}
          type={showPassword ? 'text' : 'password'}
          variant='standard'
          name='repeatPass'
          value={payload.repeatPass}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {passwordErr && <Typography sx={{ fontSize: '14px', my: 1, color: 'red' }}>{passwordErr}</Typography>}
        {/* <Link to='/forgot-password'>
          <Button disabled={!editOn} sx={{ width: 'fit-content', mt: 3 }}>Forget Password?</Button>
        </Link> */}
        <Stack direction='row' mt={2} justifyContent='space-between'>
          <Box></Box>
          {
            editOn ?
              <Stack direction='row' gap={2} alignItems='center'>
                <CButton onClick={() => {
                  setEditOn(false)
                  setPayload({
                    username: '',
                    currentPass: '',
                    newPass: '',
                    repeatPass: ''
                  })
                  setPasswordErr(null)
                }}>Cancel</CButton>
                <CButton loading={mutation.isPending} contained onClick={handleUpdate}>Save</CButton>
              </Stack>
              : <CButton onClick={() => setEditOn(true)} contained >Edit</CButton>
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Account