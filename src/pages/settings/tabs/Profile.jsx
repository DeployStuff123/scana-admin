import { CloudUpload } from '@mui/icons-material'
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiReq from '../../../../utils/axiosReq'
import CTextField from '../../../common/CTextField'
import CButton from '../../../common/CButton'
import useAuth from '../../../hook/useAuth'
import useUser from '../../../hook/useUser'
import { deleteFile, uploadFile } from '../../../../utils/fileHandler'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const [file, setFile] = useState('')
  const [editOn, setEditOn] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [payload, setPayload] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const { token } = useAuth()
  const { user } = useUser()
  const { t } = useTranslation('setting')


  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => apiReq.put('api/user/update', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['user'])
      toast.success(res.data)
      setEditOn(false)
    },
    onError: (err) => {
      toast.error(err.response.data)
    }
  })

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }


  const handleUpdate = async () => {
    let imgUrl = ''
    if (file) {
      setImgUploading(true)
      if (user?.img) {
        const publicId = user.img.split('/').pop().split('.')[0];
        await deleteFile(publicId);
      }
      const { secure_url } = await uploadFile(file);
      imgUrl = secure_url;
      setImgUploading(false)
    }
    mutation.mutate({
      name: payload.name,
      img: imgUrl
    });
  }

  useEffect(() => {
    if (user) {
      setPayload({
        username: user.username,
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email
      })
    }
  }, [user])

  
  return (
    <Box sx={{ minHeight: '600px' }} maxWidth='xl'>
      <Typography variant='h5' mb={1}>{t('profile_update')}</Typography>
      <Stack direction='row' gap={2} alignItems='center' mb={2} mt={4}>
        <Avatar src={file ? URL.createObjectURL(file) : user?.img} sx={{
          width: '80px',
          height: '80px'
        }} />
        <Stack>
          <Typography variant='h6'>{t('image')} <span style={{ fontSize: '12px', fontWeight: 400 }}>
            {t('image_type')}</span> </Typography>
          <input
            disabled={!editOn}
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            multiple
            type="file"
          />
          <label htmlFor="avatar-upload">
            <Button
              disabled={!editOn}
              component="span"
              startIcon={<CloudUpload />}
            >
              {t('upload_image')}
            </Button>
          </label>
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 6 }} mb={2}>
        <Stack sx={{ flex: 1 }} gap={2}>
          <CTextField disabled={!editOn} value={payload.name} onChange={handleInputChange} name='name' size='small' topLabel='Full Name' />
        </Stack>
        <Stack sx={{ flex: 1 }} gap={2}>
          <CTextField disabled={!editOn} inputProps={{ readOnly: true }} value={payload.email} onChange={handleInputChange} name='email' size='small' topLabel='Email' />
        </Stack>
      </Stack>
      <Stack direction='row' justifyContent='space-between' mt={4}>
        <Box />
        {
          editOn ?
            <Stack direction='row' gap={2} alignItems='center'>
              <CButton onClick={() => setEditOn(false)} >Cancel</CButton>
              <CButton onClick={handleUpdate} loading={mutation.isPending || imgUploading} contained>Update</CButton>
            </Stack>
            : <CButton onClick={() => setEditOn(true)} contained>Edit Info</CButton>
        }
      </Stack>
    </Box>
  )
}

export default Profile