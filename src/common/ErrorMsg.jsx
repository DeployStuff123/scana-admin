import { Stack, Typography } from '@mui/material'
import React from 'react'

const ErrorMsg = () => {
  return (
    <Stack sx={{
      width: '100%',p:10
    }} alignItems='center' justifyContent='center'>
      <Typography variant='body' sx={{ color: 'red', }}>Something Went Wrong!</Typography>
      {/* <Typography variant='body2'>Please try again later</Typography> */}
    </Stack>
  )
}

export default ErrorMsg