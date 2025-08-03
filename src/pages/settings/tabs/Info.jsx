import { CloudUpload } from '@mui/icons-material'
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiReq from '../../../../utils/axiosReq'
import CTextField from '../../../common/CTextField'
import CButton from '../../../common/CButton'
import useAuth from '../../../hook/useAuth'
import useUser from '../../../hook/useUser'
import { deleteFile, uploadFile } from '../../../../utils/fileHandler'

const Info = () => {
  const [file, setFile] = useState('')
  const [editOn, setEditOn] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [payload, setPayload] = useState({
    instituteName: '',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    description: '',
    welcomeMessage: '',
    youtube: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  })

  const { token } = useAuth()


  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => apiReq.put('/info/update', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['info'])
      toast.success(res.data)
      setEditOn(false)
    },
    onError: (err) => {
      toast.error(err.response.data)
    }
  })

  const { data: info } = useQuery({
    queryKey: ['info'],
    queryFn: async () => {
      const res = await axiosReq.get('/info/get')
      return res.data
    }
  })

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }


  const handleUpdate = async () => {
    if (!payload.instituteName) return toast.error('Institute Name is required')
    if (!payload.email) return toast.error('Contact Email is required')
    if (!payload.phone) return toast.error('Contact Phone is required')
    if (!payload.address) return toast.error('Address is required')
    if (file) {
      setImgUploading(true)
      if (info?.logo) {
        const publicId = info.logo.split('/').pop().split('.')[0];
        await deleteFile(publicId);
      }
      const { secure_url } = await uploadFile(file);
      payload.logo = secure_url;
      setImgUploading(false)
    }
    mutation.mutate(payload)
  }

  useEffect(() => {
    if (info) {
      setPayload(info)
    }
  }, [info])


  return (
    <Box sx={{ minHeight: '600px' }} maxWidth='xl'>
      <Typography variant='h5' mb={1}>Site Info</Typography>
      <Stack direction='row' gap={2} alignItems='center' mb={2} mt={4}>
        <img src={file ? URL.createObjectURL(file) : info?.logo} style={{
          width: '250px',
          height: '80px',
          objectFit: 'cover'
        }} />
        <Stack>
          <Typography variant='h6'>Site Logo <span style={{ fontSize: '12px', fontWeight: 400 }}>( jpg / png ) (Max 500KB)</span> </Typography>
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
              Upload
            </Button>
          </label>
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 6 }} mb={2}>
        <Stack sx={{ flex: 1 }} gap={2}>
          <CTextField disabled={!editOn} value={payload.instituteName} onChange={handleInputChange} name='instituteName' size='small' topLabel='Institute Name *' />
          <CTextField disabled={!editOn} value={payload.welcomeMessage} onChange={handleInputChange} name='welcomeMessage' size='small' topLabel='Welcome Message' />
          <CTextField disabled={!editOn} value={payload.youtube} onChange={handleInputChange} name='youtube' size='small' topLabel='Youtube Link' />
          <CTextField disabled={!editOn} value={payload.instagram} onChange={handleInputChange} name='instagram' size='small' topLabel='Instagram Link' />
        </Stack>
        <Stack sx={{ flex: 1 }} gap={2}>
          <CTextField disabled={!editOn} value={payload.email} onChange={handleInputChange} name='email' size='small' topLabel='Contact Email *' />
          <CTextField disabled={!editOn} value={payload.phone} onChange={handleInputChange} name='phone' size='small' topLabel='Contact Phone *' />
          <CTextField disabled={!editOn} value={payload.facebook} onChange={handleInputChange} name='facebook' size='small' topLabel='Facebook Link' />
          <CTextField disabled={!editOn} value={payload.linkedin} onChange={handleInputChange} name='linkedin' size='small' topLabel='Linkedin Link' />
        </Stack>
      </Stack>
      <CTextField sx={{ mb: 2 }} multiline row={3} disabled={!editOn} value={payload.address} onChange={handleInputChange} name='address' size='small' topLabel='Address *' />
      <CTextField sx={{ mb: 2 }} multiline row={3} disabled={!editOn} value={payload.description} onChange={handleInputChange} name='description' size='small' topLabel='Description' />
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

export default Info