'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '@/lib/auth';
import { notificationsApi } from '@/lib/api';
import { Notification } from '@/types';
import Link from 'next/link';

const statusColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  draft: 'default',
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'error',
  changes_requested: 'warning',
};

export default function DashboardPage() {
  const { user, company, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({
    type: 'jnf' as 'jnf' | 'inf',
    season: new Date().getMonth() < 7 ? 1 : 2,
    year: new Date().getFullYear(),
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.list();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await notificationsApi.create(newFormData);
      const notification = response.data.notification;
      
      if (newFormData.type === 'jnf') {
        window.location.href = `/jnf/${notification.id}`;
      } else {
        window.location.href = `/inf/${notification.id}`;
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <BusinessIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            CDC Portal Dashboard
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={company?.name || user?.name}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              My Submissions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your JNF and INF submissions
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              + New JNF
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setNewFormData({ ...newFormData, type: 'inf' });
                setCreateDialogOpen(true);
              }}
            >
              + New INF
            </Button>
          </Stack>
        </Box>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reference</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Season</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Submitted</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No submissions yet. Create your first JNF or INF.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => (
                    <TableRow key={notification.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {notification.reference_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={notification.type.toUpperCase()}
                          size="small"
                          color={notification.type === 'jnf' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        {notification.year} - {notification.season === 1 ? 'First' : 'Second'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={notification.status.replace('_', ' ')}
                          size="small"
                          color={statusColors[notification.status]}
                        />
                      </TableCell>
                      <TableCell>
                        {notification.submitted_at
                          ? new Date(notification.submitted_at).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            component={Link}
                            href={`/${notification.type}/${notification.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            component={Link}
                            href={`/${notification.type}/${notification.id}/preview`}
                          >
                            View
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Submission</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newFormData.type}
                onChange={(e) => setNewFormData({ ...newFormData, type: e.target.value as 'jnf' | 'inf' })}
                label="Type"
              >
                <MenuItem value="jnf">Job Notification Form (JNF)</MenuItem>
                <MenuItem value="inf">Intern Notification Form (INF)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={newFormData.season}
                onChange={(e) => setNewFormData({ ...newFormData, season: e.target.value as number })}
                label="Season"
              >
                <MenuItem value={1}>First Semester</MenuItem>
                <MenuItem value={2}>Second Semester</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={newFormData.year}
                onChange={(e) => setNewFormData({ ...newFormData, year: e.target.value as number })}
                label="Year"
              >
                {[2025, 2026, 2027].map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
