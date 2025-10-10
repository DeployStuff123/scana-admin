/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Box, Stack, TextField, IconButton, Button, Alert, Collapse, Typography, DialogActions, FormControlLabel, Switch } from '@mui/material'
import CButton from '../../common/CButton'
import apiReq from '../../../utils/axiosReq'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CloudUploadOutlined, DeleteOutlined, Info, PersonOutline } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { deleteFile, uploadFile } from '../../../utils/fileHandler'
import useAuth from '../../hook/useAuth'
import { useTranslation } from 'react-i18next'

const EditUser = ({ userData, closeDialog }) => {
  const [removeUserDialog, setRemoveUserDialog] = useState(false)
  const [img, setImg] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [formData, setFormData] = useState({
    img: '',
    name: '',
    username: '',
    email: '',
    isBlocked: false
  })

  const { token } = useAuth()
  const [error, setError] = useState('')

  const { t } = useTranslation('userList')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => apiReq.put(`/api/user/admin/update/${userData._id}`, data, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      closeDialog()
      toast.success(res.data.message)
    },
    onError: (error) => {
      setError(error.response.data)
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id) => apiReq.delete(`/api/user/admin/remove/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setRemoveUserDialog(false)
      closeDialog()
      toast.success(res.data.message)
    }
  })

  const handleSubmit = async () => {

    if (formData.name === '') {
      setError({
        name: 'Full Name is required',
      })
      return
    }



    if (img) {
      setFileUploadLoading(true)
      const res = await uploadFile(img)
      console.log(res)
      formData.img = res.secure_url
      if (userData.img) {
        const publicId = userData.img.split('/').pop().split('.')[0]
        await deleteFile(publicId)
      }
      setFileUploadLoading(false)
    }
    else {
      setError({
        name: '',
      })
    }
    mutation.mutate(formData)
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const hanldeRemoveUser = () => {
    removeMutation.mutate(userData._id)
  }

  useEffect(() => {
    setFormData({
      username: userData.username,
      email: userData.email,
      img: userData.img,
      name: userData.name,
      isBlocked: userData.isBlocked
    })
  }, [userData])

  return (
    <Box>
      <Stack direction='column' spacing={2}>
        <TextField
          label='Username'
          name='username'
          value={formData.username}
          onChange={handleChange}
          error={Boolean(error.username)}
          helperText={error.username}
          disabled
        />
        <TextField
          label='Full Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          error={Boolean(error.name)}
          helperText={error.name}
        />
        <TextField
          label='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          error={Boolean(error.email)}
          helperText={error.email}
          disabled
        />
        <FormControlLabel
          control={<Switch checked={formData.isBlocked} onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })} name='isBlocked' />}
          label='Block'
        />
        {/* show it on tooltip */}
        <Typography sx={{ display: 'flex',color:'gray',fontSize:'14px', alignItems: 'center', gap: 1 }}> <Info color='warning' fontSize='small' /> if a user blocked, it will disable all links and follow-up associate with this user</Typography>
        {/* profile image */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          position: 'relative'
        }}>
          {img || formData?.img ? (
            <>
              <Box
                component="img"
                src={img ? URL.createObjectURL(img) : formData?.img}
                alt="profile"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={() => {
                  setImg(null)
                  setFormData({ ...formData, img: '' })
                }}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'error.dark'
                  }
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </>
          ) : (
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonOutline sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadOutlined />}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </Button>
        </Box>
        <CButton loading={mutation.isPending || fileUploadLoading} variant='contained' color='primary' onClick={handleSubmit}>{t('update')}</CButton>
      </Stack>
      <CButton style={{ mt: 1 }} color='error' onClick={() => setRemoveUserDialog(true)}>{t('remove_user')}</CButton>

      <Collapse in={removeUserDialog}>
        <Stack direction='column' spacing={2}>
          <Typography sx={{ color: 'error.main' }}>{t('remove_desc')}</Typography>
          <DialogActions>
            <CButton loading={removeMutation.isPending} variant='contained' color='error' onClick={hanldeRemoveUser}>{t('remove_user')}</CButton>
            <CButton variant='contained' color='primary' onClick={() => setRemoveUserDialog(false)}>{t('cancel')}</CButton>
          </DialogActions>
        </Stack>
      </Collapse>
    </Box>
  )
}

export default EditUser