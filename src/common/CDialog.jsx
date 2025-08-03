/* eslint-disable react/prop-types */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Grow, Stack } from '@mui/material';
import useIsMobile from '../hook/useIsMobile';
import { Close } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default function CDialog({
  open,
  onClose,
  children,
  maxWidth,
  fullScreen,
  title,
  disableOutsideClick,
  closeButton = false
}) {
  const isMobile = useIsMobile();

  return (
    <Dialog
      fullScreen={isMobile || fullScreen}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth
      onClose={(event, reason) => {
        if (reason === 'backdropClick' && !disableOutsideClick) {
          onClose(event, reason);
        } else if (reason !== 'backdropClick') {
          onClose(event, reason);
        }
      }}
      open={open}
      disableEscapeKeyDown
    >
      <DialogContent>
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{title}</Typography>
          {
            closeButton && (
              <IconButton onClick={onClose} aria-label="close">
                <Close />
              </IconButton>
            )
          }
        </Stack>
        {children}
      </DialogContent>
    </Dialog>
  );
}