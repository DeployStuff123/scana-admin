import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Outlet } from 'react-router-dom';
import CDrawer from './CDrawer';
import { useState } from 'react';
import { Avatar, Badge, ClickAwayListener, Divider, FormControlLabel, Grow, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, Zoom } from '@mui/material';
import { Logout, NotificationsNone, Person, PersonOutline, SettingsOutlined } from '@mui/icons-material';
import BreadCrumb from '../common/BreadCrumb';
import useAuth from '../hook/useAuth';
import useUser from '../hook/useUser';
import LanguageSwitcher from '../components/LanguageSwitcher';

const drawerWidth = 260;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { setToken } = useAuth()

  const { user } = useUser()

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: {xs:'', md:'flex'}, bgcolor: 'bg', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: 'black',
          boxShadow: 0
        }}
      >
        <Toolbar sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box />
          <Stack direction='row' alignItems='center' gap={2}>
            {/* <Link to='notifications'>
              <IconButton>
                <Badge badgeContent={9} color='warning'>
                  <NotificationsNone />
                </Badge>
              </IconButton>
            </Link> */}
            <LanguageSwitcher />
            <ClickAwayListener onClickAway={() => setUserMenuOpen(false)}>
              <Stack onClick={() => setUserMenuOpen(p => !p)} sx={{ cursor: 'pointer', userSelect: 'none' }} direction='row' gap={1}>
                <Avatar src={user?.img ?? ''} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{user?.role}</Typography>
                </Box>
              </Stack>
            </ClickAwayListener>
            {/* user menu */}
            <Grow in={userMenuOpen}>
              <Box sx={{
                position: 'absolute',
                top: 70,
                right: 5,
                bgcolor: '#fff',
                width: '200px',
                borderRadius: '4px',
                boxShadow: 2
              }}>
                <Stack gap={2} p={2}>
                  {/* <Link to='/dashboard/setting/profile' className='link'>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <PersonOutline fontSize='small' />
                      </ListItemIcon>
                      <Typography sx={{ fontSize: '14px' }}>View Profile</Typography>
                    </ListItem>
                  </Link> */}
                  <Link to='/dashboard/setting' className='link'>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <SettingsOutlined fontSize='small' />
                      </ListItemIcon>
                      <Typography sx={{ fontSize: '14px' }}>Account Settings</Typography>
                    </ListItem>
                  </Link>
                </Stack>
                <Divider />
                <ListItemButton onClick={() => setToken('')}>
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Log out</ListItemText>
                </ListItemButton>
              </Box>
            </Grow>
            {/* user menu end */}
          </Stack>
        </Toolbar>
        <Divider />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <CDrawer handleDrawerClose={handleDrawerClose} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <CDrawer handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Box>
      <Box
        sx={{ flexGrow: 1, p: { xs: 1, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Box mb={2}>
          <BreadCrumb />
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
