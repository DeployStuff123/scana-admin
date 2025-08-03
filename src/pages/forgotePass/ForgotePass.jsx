import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Box, } from '@mui/material'
import apiReq from '../../../utils/axiosReq'
import CTextField from '../../common/CTextField'
import CButton from '../../common/CButton'

const ForgotePass = () => {
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: (email) => apiReq.post('/auth/forgot-password', { email }),
    onSuccess: (res) => {
      setEmail('')
      toast.success(res.data.message)
    },
    onError: (err) => {
      toast.error(err.response.data)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Email is required')
    try {
      await mutation.mutateAsync(email)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box sx={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 2
    }}>
      <h2>Reset Password</h2>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
        <CTextField
          sx={{ mb: 2, minWidth: '300px' }}
          type="email"
          size='small'
          topLabel='Enter your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CButton type="submit" variant='contained' loading={mutation.isPending}>
          Reset Password
        </CButton>
      </form>
      {mutation.data && <p>{mutation.data.data.message}</p>}
      {mutation.error && <p>Error: {mutation.error.response.data}</p>}
    </Box>
  )
}

export default ForgotePass