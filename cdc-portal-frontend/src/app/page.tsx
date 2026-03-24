'use client';

import { Box, Container, Typography, Button, Grid, Card, CardContent, AppBar, Toolbar, Chip, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

const stats = [
  { icon: <BusinessIcon />, value: '500+', label: 'Companies' },
  { icon: <TrendingUpIcon />, value: '95%', label: 'Placement Rate' },
  { icon: <SchoolIcon />, value: '₹48 LPA', label: 'Highest CTC' },
  { icon: <GroupsIcon />, value: '32+', label: 'Departments' },
];

const usps = [
  {
    title: 'Heritage & Excellence',
    description: 'IIT (ISM) Dhanbad, established in 1926, is one of the oldest and most prestigious engineering institutes in India.',
  },
  {
    title: 'Unique Programmes',
    description: 'Exclusive programmes in Mining, Petroleum, and Earth Sciences alongside traditional engineering disciplines.',
  },
  {
    title: 'Specialised Talent',
    description: 'Graduates equipped with both technical expertise and practical industry experience.',
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main', py: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CDC Portal | IIT (ISM) Dhanbad
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Button variant="contained" color="secondary" component={Link} href="/register">
              Register Now
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B459C 0%, #003399 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Career Development Centre
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>
            IIT (ISM) Dhanbad
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
            Connecting Top Talent with Leading Organizations
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              component={Link}
              href="/register"
            >
              Register Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
              startIcon={<DownloadIcon />}
            >
              Download Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Card sx={{ textAlign: 'center', py: 3 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
            Why Recruit at IIT (ISM)?
          </Typography>
          <Grid container spacing={4}>
            {usps.map((usp, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      {usp.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {usp.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
            Quick Links
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Chip label="Brochure Download" icon={<DownloadIcon />} component={Link} href="/brochure" clickable />
            <Chip label="Past Recruiters" component={Link} href="/recruiters" clickable />
            <Chip label="Contact CDC" component={Link} href="/contact" clickable />
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9 }}>
            Career Development Centre, IIT (ISM) Dhanbad | cdc@iitism.ac.in
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.7, mt: 1 }}>
            © {new Date().getFullYear()} All Rights Reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
