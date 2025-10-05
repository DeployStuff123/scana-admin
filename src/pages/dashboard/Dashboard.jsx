import { useQuery } from '@tanstack/react-query';
import apiReq from '../../../utils/axiosReq';
import Loader from '../../common/Loader';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import useAuth from '../../hook/useAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  People as PeopleIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  InsertLink
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom'
import { useState } from 'react';

const Dashboard = () => {
  const [filter, setFilter] = useState('all');
  const { token } = useAuth();
  const theme = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get(`api/dashboard/admin?filter=${filter}`, { headers: { Authorization: token } }),
    queryKey: ['dashboard', filter]
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Typography color="error">Error loading dashboard data</Typography>;

  const dashboardData = data?.data || {
    totalUsers: 0,
    totalLinks: 0,
    totalVisits: 0,
    totalEmails: 0,
    recentLinks: [],
    topLinks: [],
    recentEmails: []
  };

  // Prepare data for charts
  const topLinksChartData = dashboardData.topLinks
    .filter(link => link.visits > 0) // Only show links with visits
    .map(link => ({
      name: link?.slug,
      visits: link?.visits,
      user: link?.user?.username
    }));

  const summaryCards = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.primary.main
    },
    {
      title: 'Total Links',
      value: dashboardData.totalLinks,
      icon: <InsertLink fontSize="large" />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Total Visits',
      value: dashboardData.totalVisits,
      icon: <TrendingUpIcon fontSize="large" />,
      color: theme.palette.success.main
    },
    {
      title: 'Total Emails',
      value: dashboardData.totalEmails,
      icon: <EmailIcon fontSize="large" />,
      color: theme.palette.warning.main
    }
  ];

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: { xs: 2, md: 3 },
      borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Stack mb={4} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'start', md: 'center' }} justifyContent="space-between">
        <Typography variant="h5" mb={4} component="h1" gutterBottom>
          Dashboard Overview
        </Typography>
        <FormControl size="small">
          <InputLabel>Filter</InputLabel>
          <Select
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            sx={{ width: '200px' }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card?.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {card?.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card?.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Top Links Bar Chart */}
        <Grid item xs={12} md={12}>
          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid lightgray', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Links
            </Typography>
            {topLinksChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topLinksChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="10 10" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill={theme.palette.primary.main} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No visit data available</Typography>
              </Box>
            )}
          </Box>
        </Grid>

      </Grid>

      {/* Recent Activity Section */}
      <Grid container spacing={3}>
        {/* Recent Links */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid lightgray' }}>
            <Typography variant="h6" gutterBottom>
              Recent Links
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Slug</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell align="right">Visits</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentLinks.map((link) => (
                    <TableRow key={link._id}>
                      <TableCell>
                        <Link to={`redirect-links/${link.slug}`}>
                          {link.slug}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {link.destinationUrl}
                      </TableCell>
                      <TableCell align="right">{link.visits}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {format(parseISO(link.createdAt), 'MMM d')}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Recent Email Captures */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid lightgray' }}>
            <Typography variant="h6" gutterBottom>
              Recent Email Captures
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Captured</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentEmails.map((email) => (
                    <TableRow key={email._id}>
                      <TableCell>{email.email}</TableCell>
                      <TableCell>{email.link.slug}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {format(parseISO(email.visitedAt), 'MMM d, h:mm a')}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;