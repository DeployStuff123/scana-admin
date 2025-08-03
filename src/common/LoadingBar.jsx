import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './LoadingBar.css';

export default function LoadingBar() {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      // top: {xs: 44,sm: 60,md:60},
      left: 0,
      width: '100%' ,
      zIndex: '1100',
      }}>
      <LinearProgress color="primary" />
    </Box>
  );
}