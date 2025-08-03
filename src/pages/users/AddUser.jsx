import React, { useState } from 'react'
import { Box, Stack, TextField, IconButton, Button, Alert } from '@mui/material'
import CButton from '../../common/CButton'
import apiReq from '../../../utils/axiosReq'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CloudUploadOutlined, DeleteOutlined, PersonOutline } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { uploadFile } from '../../../utils/fileHandler'
import useAuth from '../../hook/useAuth'
import { useTranslation } from 'react-i18next'

const AddUser = ({ closeDialog }) => {
  const [img, setImg] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [formData, setFormData] = useState({
    img:'',
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const { t } = useTranslation('userList')
  
  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => apiReq.post('/api/user/admin/create-user', data, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      closeDialog()
      toast.success(res.data.message)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      setError(error.response.data)
    }
  })

  const handleSubmit = async () => {
    if (formData.username === '') {
      setError({
        username: 'Username is required',
      })
      return
    }
    if (formData.name === '') {
      setError({
        name: 'Name is required',
      })
      return
    }
    if (formData.email === '') {
      setError({
        email: 'Email is required',
      })
      return
    }
    if (formData.password === '') {
      setError({
        password: 'Password is required',
      })
      return
    }


    if (formData.password !== formData.confirmPassword) {
      setError({
        password: 'Passwords do not match',
        confirmPassword: 'Passwords do not match',
      })
      return
    }
    if(img) {
      setFileUploadLoading(true)
      const res = await uploadFile(img)
      setFileUploadLoading(false)
      formData.img = res.secure_url
    }
    else {
      setError({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
    mutation.mutate(formData)
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
        />
        <TextField
          label='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          error={Boolean(error.password)}
          helperText={error.password}
        />
        <TextField
          label='Confirm Password'
          name='confirmPassword'
          value={formData.confirmPassword}
          onChange={handleChange}
          error={Boolean(error.confirmPassword)}
          helperText={error.confirmPassword}
        />
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
          {img ? (
            <>
              <Box
                component="img"
                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                alt="profile"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={() => setImg(null)}
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
        <CButton loading={mutation.isPending || fileUploadLoading} variant='contained' color='primary' onClick={handleSubmit}>{t('add_user')}</CButton>
      </Stack>
    </Box>
  )
}

export default AddUser