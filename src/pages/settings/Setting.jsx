import { Box, Paper, Stack, Tab, Tabs, styled, tabClasses, tabsClasses, useMediaQuery } from "@mui/material";
import PropTypes from 'prop-types';
import { useState } from "react";
import Profile from "./tabs/Profile";
import Account from "./tabs/Account";
import Info from "./tabs/Info";


const TabItem = styled(Tab)(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  textAlign: "center",
  textTransform: 'none',
  transition: "all .5s",
  marginRight: '10px',
  float: "none",
  fontSize: "14px",
  [theme.breakpoints.up("md")]: {
    minWidth: 120,
  },
  [`&.${tabClasses.selected}`]: {
    backgroundColor: '#fff',
    border: '1px solid lightgray'
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const tabName = [
  // 'Info',
  'Profile',
  'Account'
]

const Setting = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Stack direction='row' sx={{ justifyContent: 'center', }}>
        <Tabs
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabIndex}
          onChange={(e, index) => setTabIndex(index)}
          sx={{
            width: "100%",
            bgcolor: 'light.main',
            borderRadius: '8px',
            py: 2,
            [`& .${tabsClasses.indicator}`]: {
              display: "none",
            },
          }}
        >
          {
            tabName.map((item) => (
              <TabItem key={item} disableRipple label={item} />
            ))
          }
        </Tabs>
      </Stack>

      <Box maxWidth='lg' sx={{ p: { xs: 1, lg: 3 } }}>
        <CustomTabPanel value={tabIndex} index={0}><Profile /></CustomTabPanel>
        <CustomTabPanel value={tabIndex} index={1}><Account /></CustomTabPanel>
      </Box>

    </Box>
  )
}

export default Setting