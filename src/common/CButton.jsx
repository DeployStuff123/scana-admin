/* eslint-disable react/prop-types */
import React from "react";
import { Button, CircularProgress } from "@mui/material";

const CButton = ({
  children,
  onClick,
  onSubmit,
  startIcon,
  endIcon,
  color = 'primary',
  variant = 'text',
  size = 'medium',
  loading = false,
  disable = false,
  rounded = false,
  small = false,
  large = false,
  contained = false,
  outlined = false,
  style = {},
  ...props
}) => {
  return (
    <Button
      sx={{
        textTransform: "none",
        boxShadow: "none",
        borderRadius: rounded ? '50px' : '4px',
        whiteSpace: 'nowrap',
        position: "relative",
        ...style,
      }}
      size={small ? 'small' : large ? 'large' : size}
      variant={contained ? 'contained' : outlined ? 'outlined' : variant}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={loading || disable}
      color={color}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Button>
  );
};

export default CButton;
