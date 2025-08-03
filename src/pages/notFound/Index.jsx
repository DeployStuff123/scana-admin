import { Box, Stack } from '@mui/material'
import React from 'react'

const NotFound = () => {
  return (
    <Stack alignItems='center' justifyContent='center' sx={{
      // bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '80vh'
    }}>
      <h1>Page Not Found!</h1>
    </Stack>
  )
}

export default NotFound