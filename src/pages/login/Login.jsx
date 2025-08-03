/* eslint-disable react/prop-types */
import { Box, Button, Container, IconButton, Input, InputAdornment, Stack, TextField, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { KeyboardArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hook/useAuth';
import apiReq from '../../../utils/axiosReq'
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [forgotePassSecOpen, setForgotePassSecOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState({ email: '' });

  const { t } = useTranslation('login');

  const { setToken } = useAuth()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => apiReq.post('api/user/login', input),
    onSuccess: (res) => {
      if (res.data.user.role === 'admin') {
        queryClient.invalidateQueries(['login']);
        setToken(res.data.jwt)
        toast.success(res.data.message)
      } else {
        toast.error('You are not authorized to access this page')
      }
    },
    onError: (err) => {
      toast.error(err.response.data)
    }
  })

  const handleSubmit = (event) => {
    handleKeyPress(event)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    mutation.mutate({
      email: data.get('email'),
      password: data.get('password'),
    })
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const passResetData = ''

  const passwordVisibilityHandler = () => setPasswordVisibility(!passwordVisibility);

  return (
    <Container maxWidth={false} sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Box sx={{
        position: 'absolute',
        top: 10,
        right: 10
      }}>
        <LanguageSwitcher />
      </Box>
      <Paper elevation={16} sx={{
        width: '100%',
        maxWidth: '450px',
        borderRadius: 3,
        p: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {forgotePassSecOpen ? (
          <Box>
            <Button
              onClick={() => setForgotePassSecOpen(false)}
              startIcon={<KeyboardArrowLeft />}
              sx={{
                mb: 3,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              Back to Login
            </Button>

            {passResetData ? (
              <Typography sx={{
                bgcolor: 'primary.light',
                color: 'primary.main',
                p: 3,
                borderRadius: 2,
                textAlign: 'center'
              }}>
                {passResetData.passwordResetMail.message}
              </Typography>
            ) : (
              <Stack spacing={4}>
                <Typography variant="h5" fontWeight={600} textAlign="center">
                  Reset Password
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={forgotEmail.email}
                  onChange={(e) => setForgotEmail({ email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Send Reset Link
                </Button>
              </Stack>
            )}
          </Box>
        ) : (
          <Stack spacing={4}>
            <Box textAlign="center">
              <Box component="img" src="/logo-colored.png" sx={{ width: 200 }} />
              <Typography variant="h6" color="text.secondary">
                {t('admin_portal')}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="email"
                  label={t('email')}
                  variant="outlined"
                  required
                  fullWidth
                  onKeyDown={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  name="password"
                  label={t('password')}
                  variant="outlined"
                  required
                  fullWidth
                  type={passwordVisibility ? "text" : "password"}
                  onKeyDown={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={passwordVisibilityHandler}
                          edge="end"
                          sx={{
                            color: 'text.secondary'
                          }}
                        >
                          {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* <Typography
                  onClick={() => setForgotePassSecOpen(true)}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    textAlign: 'right',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Typography> */}

                <CButton
                  type="submit"
                  loading={mutation.isPending}
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    mt: 2
                  }}
                >
                  {t('submit')}
                </CButton>
              </Stack>
            </form>
          </Stack>
        )}
      </Paper>
    </Container>
  )
}

export default Login