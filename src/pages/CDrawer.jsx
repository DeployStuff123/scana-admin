/* eslint-disable react/prop-types */
import { AddBoxOutlined, FiberManualRecord, ForwardToInboxOutlined, GridViewOutlined, KeyboardArrowDown, ListAlt, Person3, Person3Outlined, PlaylistAdd, PlaylistPlayOutlined, Settings, SettingsOutlined, SpaceDashboard, SpaceDashboardOutlined } from '@mui/icons-material';
import { Badge, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import apiReq from '../../utils/axiosReq';
import { useTranslation } from 'react-i18next';


const CDrawer = ({ handleDrawerClose }) => {
  const [expandedNavlinkIndex, setExpandedNavlinkIndex] = useState(0);

  const { token } = useAuth()

  const { t } = useTranslation('dashboard');

  const { data : followUp } = useQuery({
    queryFn: async () => await apiReq.get('api/follow-up/all', { headers: { Authorization: token } }),
    queryKey: ['follow-ups']
  });

  const handleExpandedNavlink = (index) => {
    setExpandedNavlinkIndex(expandedNavlinkIndex === index ? null : index);
  };


  const links = [
    { name: t('dashboard'), icon: <GridViewOutlined />, path: '', end: true },
    { name: t('user_lists'), icon: <Person3Outlined />, path: 'users'},
    { name: t('redirect_links'), icon: <ListAlt />, path: 'redirect-links' },
    { name: t('follow_up'), icon: <ForwardToInboxOutlined />, path: 'follow-up', notification: followUp?.data?.filter(item => !item.approved).length },
    { name: t('setting'), icon: <SettingsOutlined />, path: 'setting' },
  ];


  return (
    <Stack>
      <Stack alignItems='center'>
        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          height: '64px'
        }}>
          <img style={{ width: '100px' }} src="/logo-white.png" alt="" />
        </Box>
      </Stack>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 10 }}>
        {links.map((item, index) => (
          <ListItem disablePadding key={index} sx={{ display: 'block' }}>
            {item.more ? (
              <>
                <ListItemButton
                  sx={{ px: 1, mx: 2, borderRadius: '5px', mb: 0.5, color: 'gray' }}
                  onClick={() => handleExpandedNavlink(index)}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <KeyboardArrowDown />
                </ListItemButton>
                <Collapse in={expandedNavlinkIndex === index} timeout="auto" unmountOnExit>
                  <List disablePadding component="div">
                    {item.more.map((subItem, id) => (
                      <NavLink
                        end={subItem.end}
                        onClick={handleDrawerClose}
                        className="link"
                        key={id}
                        to={subItem.path}
                      >
                        {({ isActive }) => (
                          <ListItemButton
                            sx={{
                              ml: 5,
                              mr: 2,
                              mb: 0.5,
                              borderRadius: '5px',
                              bgcolor: isActive ? 'primary.main' : '',
                              color: isActive ? '#fff' : 'gray',
                              ':hover': {
                                bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                              },
                            }}
                          >
                            <FiberManualRecord sx={{ fontSize: '8px', mr: 2 }} />
                            <Typography sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                              {subItem.name}
                            </Typography>
                          </ListItemButton>
                        )}
                      </NavLink>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <NavLink end={item.end} className="link" to={item.path}>
                {({ isActive }) => (
                  <Stack
                    direction='row'
                    alignItems='center'
                    onClick={handleDrawerClose}
                    sx={{
                      py: 1,
                      px: 1,
                      mx: 2,
                      borderRadius: '5px',
                      bgcolor: isActive ? 'primary.main' : '',
                      color: isActive ? '#fff' : 'gray',
                      ':hover': {
                        bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    <Badge sx={{ mr: 2 }} badgeContent={item.notification} color="warning" />
                  </Stack>
                )}
              </NavLink>
            )}
          </ListItem>
        ))}
      </List>

    </Stack>
  )
}

export default CDrawer