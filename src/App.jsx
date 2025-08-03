import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NotFound from './pages/notFound/Index'
import { useEffect } from 'react'
import Layout from './pages/Layout'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Setting from './pages/settings/Setting'
import { Box } from '@mui/material'
import useAuth from './hook/useAuth'
import ForgotePass from './pages/forgotePass/ForgotePass'
import PasswordReset from './pages/password-reset/PasswordReset'
import RedirectLinkDetails from './pages/redirectLinkDetails/RedirectLinkDetails'
import UserLists from './pages/users/UserLists'
import RedirectLinks from './pages/redirectLinks/RedirectLinks'
import UserDetails from './pages/userDetails/UserDetails'
import FollowUp from './pages/followUp/FollowUp'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname]);
  return null;
}


function App() {

  const { token } = useAuth()

  return (
    <Box>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path='/login' element={token ? <Navigate to='/dashboard' /> : <Login />} />
        <Route path='forgot-password' element={<ForgotePass />} />
        <Route path='password-reset/:token' element={<PasswordReset />} />
        <Route path='/dashboard' element={token ? <Layout /> : <Login />}>
          <Route path='' element={<Dashboard />} />
          <Route path='redirect-links' element={<RedirectLinks />} />
          <Route path='users' element={<UserLists />} />
          <Route path='users/:username' element={<UserDetails />} />
          <Route path='redirect-links/:slug' element={<RedirectLinkDetails />} />
          <Route path='follow-up' element={<FollowUp />} />
          <Route path='setting' element={<Setting />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Box>
  )
}

export default App
