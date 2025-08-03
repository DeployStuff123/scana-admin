/* eslint-disable react/prop-types */
import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';

const CTextField = ({
  label = '',
  topLabel = '',
  value = '',
  onChange = () => { },
  name = '',
  variant = 'outlined',
  fullWidth = true,
  error = false,
  helperText = '',
  multiline = false,
  row = 1,
  disabled = false,
  ...props
}) => {
  return (
    <Stack width='100%'>
      {topLabel && (
        <Typography variant="subtitle2" color="textSecondary">
          {topLabel}
        </Typography>
      )}
      <TextField
        sx={{
          '& .MuiInputBase-root': {
            opacity: disabled ? 0.5 : 1
          }
        }}
        label={label}
        value={value}
        onChange={onChange}
        name={name}
        multiline={multiline}
        rows={row}
        variant={variant}
        fullWidth={fullWidth}
        error={error}
        helperText={helperText}
        {...props}
        disabled={disabled}
      />
    </Stack>
  );
};

export default CTextField;
