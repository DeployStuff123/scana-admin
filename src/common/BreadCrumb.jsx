import { KeyboardDoubleArrowRight } from '@mui/icons-material';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumb = (props) => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs sx={props.style}>
      {/* Home Link */}
      {/* <Link className="link" to="/">
        Home
      </Link> */}
      <KeyboardDoubleArrowRight sx={{ mt: 1 }} />

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return index === pathnames.length - 1 ? (
          <Typography color="text.primary" key={to}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <MuiLink component={Link} to={to} key={to} color="inherit" style={{ textDecoration: 'none' }}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
