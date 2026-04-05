'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputLabel,
} from '@mui/material';
import { useAuth } from '@/lib/auth';
import { notificationsApi } from '@/lib/api';
import { Notification } from '@/types';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import CompanyProfile from './profile';
import CompanyContacts from './contacts';
const statusStyleMap: Record<string, { bgcolor: string; color: string }> = {
  draft: { bgcolor: 'rgba(90,100,120,0.1)', color: '#5A6478' },
  submitted: { bgcolor: 'rgba(27,94,107,0.1)', color: '#1B5E6B' },
  under_review: { bgcolor: 'rgba(200,146,42,0.15)', color: '#8B6000' },
  approved: { bgcolor: 'rgba(34,100,60,0.1)', color: '#1d6b3a' },
  rejected: { bgcolor: 'rgba(139,26,26,0.1)', color: '#8B1A1A' },
  changes_requested: { bgcolor: 'rgba(139,26,26,0.1)', color: '#8B1A1A' },
};

export default function DashboardPage() {
  const { user, company, logout } = useAuth();
  
  const { data: notificationsData, isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
  });
  const notifications: Notification[] = notificationsData?.data?.notifications || [];

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeSideItem, setActiveSideItem] = useState('Submissions');
  const [newFormData, setNewFormData] = useState({
    type: 'jnf' as 'jnf' | 'inf',
    season: new Date().getMonth() < 7 ? 1 : 2,
    year: new Date().getFullYear(),
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const sidebarItems = user?.role === 'admin' ? [
    { label: 'Submissions' },
    { label: 'Analytics' },
    { label: 'Recruiters' },
    { label: 'Export Data' },
    { label: 'Audit Log' },
  ] : [
    { label: 'Submissions' },
    { label: 'Company Profile' },
    { label: 'Contacts & HR' },
  ];

  const createMutation = useMutation({
    mutationFn: (data: any) => notificationsApi.create(data),
    onSuccess: (response: any) => {
      const notification = response.data.notification;
      if (newFormData.type === 'jnf') {
        window.location.href = `/jnf/${notification.id}`;
      } else {
        window.location.href = `/inf/${notification.id}`;
      }
    },
    onError: (error: any) => {
      console.error('Failed to create notification:', error);
    }
  });

  const handleCreate = () => createMutation.mutate(newFormData);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const filteredNotifications = statusFilter === 'all'
    ? notifications
    : notifications.filter(n => n.status === statusFilter);

  // Calculate metrics
  const totalSubmissions = notifications.length;
  const approvedCount = notifications.filter(n => n.status === 'approved').length;
  const reviewCount = notifications.filter(n => n.status === 'under_review').length;
  const pendingCount = notifications.filter(n => n.status === 'draft' || n.status === 'submitted').length;

  const metrics = [
    { value: totalSubmissions, label: 'Total submissions' },
    { value: approvedCount, label: 'Approved' },
    { value: reviewCount, label: 'Under Review' },
    { value: pendingCount, label: 'Drafts / Pending' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Strip */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          px: '2rem',
          py: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.02em',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px' }}>Home</Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{user?.email}</span>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 220,
            bgcolor: '#0A1628',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          {/* Sidebar Logo */}
          <Box sx={{ px: 2, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', mb: 1.5 }}>
            <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '15px', color: '#FEFEFE', fontWeight: 500 }}>
              {company?.name || user?.name || 'Dashboard'}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              {user?.role === 'admin' ? 'CDC Admin Panel' : 'Recruiter Portal'}
            </Typography>
          </Box>

          {/* Nav Items */}
          {sidebarItems.map((item) => (
            <Box
              key={item.label}
              onClick={() => setActiveSideItem(item.label)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                px: 2,
                py: '9px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderLeft: activeSideItem === item.label ? '3px solid #C8922A' : '3px solid transparent',
                color: activeSideItem === item.label ? '#E8B64A' : 'rgba(255,255,255,0.55)',
                bgcolor: activeSideItem === item.label ? 'rgba(200,146,42,0.08)' : 'transparent',
                '&:hover': {
                  color: 'rgba(255,255,255,0.85)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.6, flexShrink: 0 }} />
              {item.label}
            </Box>
          ))}

          {/* Settings at bottom */}
          <Box sx={{ mt: 'auto' }}>
            <Box
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                px: 2,
                py: '9px',
                mb: 2,
                fontSize: '13px',
                cursor: 'pointer',
                borderLeft: '3px solid transparent',
                color: 'rgba(255,255,255,0.55)',
                transition: 'all 0.15s',
                '&:hover': { color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(255,255,255,0.05)' },
              }}
              id="logout-btn"
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.6, flexShrink: 0 }} />
              Sign Out
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#FEFEFE' }}>
          {/* Top Bar */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid rgba(10,22,40,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>
                {activeSideItem === 'Submissions' ? 'All Submissions' : activeSideItem}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mt: '2px' }}>
                {company?.name || user?.name} · {user?.role === 'admin' ? 'CDC Admin Dashboard' : 'Recruiter Dashboard'}
              </Typography>
            </Box>
            
            {activeSideItem === 'Submissions' && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '12.5px',
                  minWidth: 120,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(10,22,40,0.12)' },
                }}
                id="status-filter"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
              <Button
                sx={{
                  fontSize: '12.5px',
                  color: '#0A1628',
                  border: '1px solid rgba(10,22,40,0.15)',
                  borderRadius: '4px',
                  px: '14px',
                  py: '5px',
                  '&:hover': { bgcolor: '#F4F6F9' },
                }}
                id="export-btn"
              >
                Export .xlsx
              </Button>
            </Box>
            )}
          </Box>

          {activeSideItem === 'Submissions' && (
            <>
              {/* Metrics */}
              <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              px: 3,
              py: 2.5,
              borderBottom: '1px solid rgba(10,22,40,0.12)',
            }}
          >
            {metrics.map((metric) => (
              <Box
                key={metric.label}
                sx={{
                  bgcolor: '#F4F6F9',
                  borderRadius: '8px',
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"EB Garamond", serif',
                    fontSize: '26px',
                    fontWeight: 500,
                    color: '#0A1628',
                    lineHeight: 1,
                    mb: '4px',
                  }}
                >
                  {metric.value}
                </Typography>
                <Typography sx={{ fontSize: '11.5px', color: '#5A6478' }}>
                  {metric.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Action Bar */}
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(10,22,40,0.12)' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>
              My Submissions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => { setNewFormData({ ...newFormData, type: 'jnf' }); setCreateDialogOpen(true); }}
                id="new-jnf-btn"
                sx={{
                  bgcolor: '#0A1628',
                  color: '#FEFEFE',
                  fontSize: '12.5px',
                  px: '16px',
                  py: '6px',
                  borderRadius: '4px',
                  fontWeight: 500,
                  '&:hover': { bgcolor: '#2C3345' },
                }}
              >
                + New JNF
              </Button>
              <Button
                onClick={() => { setNewFormData({ ...newFormData, type: 'inf' }); setCreateDialogOpen(true); }}
                id="new-inf-btn"
                sx={{
                  fontSize: '12.5px',
                  color: '#1B5E6B',
                  border: '1px solid rgba(27,94,107,0.3)',
                  borderRadius: '4px',
                  px: '16px',
                  py: '6px',
                  '&:hover': { bgcolor: 'rgba(27,94,107,0.05)' },
                }}
              >
                + New INF
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
            <TableContainer>
              <Table sx={{ '& td, & th': { borderBottomColor: 'rgba(10,22,40,0.08)' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Reference</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Season</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Submitted</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                        <CircularProgress size={28} sx={{ color: '#0A1628' }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                        <Box>
                          <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 1 }}>
                            No submissions yet
                          </Typography>
                          <Typography sx={{ fontSize: '12.5px', color: '#5A6478', opacity: 0.7 }}>
                            Create your first JNF or INF using the buttons above.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id} sx={{ '&:hover td': { bgcolor: '#F4F6F9' }, transition: 'background 0.1s' }}>
                        <TableCell sx={{ fontWeight: 500, fontSize: '13px', color: '#0A1628' }}>
                          {company?.name || '—'}
                        </TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '11px',
                              fontWeight: 500,
                              px: '7px',
                              py: '2px',
                              borderRadius: '3px',
                              ...(notification.type === 'jnf'
                                ? { bgcolor: 'rgba(10,22,40,0.06)', color: '#0A1628' }
                                : { bgcolor: 'rgba(27,94,107,0.08)', color: '#1B5E6B' }),
                            }}
                          >
                            {notification.type.toUpperCase()}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '12.5px', color: '#5A6478', fontFamily: '"JetBrains Mono", monospace' }}>
                          {notification.reference_number}
                        </TableCell>
                        <TableCell sx={{ fontSize: '12.5px', color: '#5A6478' }}>
                          {notification.year} — {notification.season === 1 ? 'S1' : 'S2'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '12.5px', color: '#5A6478' }}>
                          {notification.submitted_at
                            ? new Date(notification.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              px: '10px',
                              py: '3px',
                              borderRadius: '20px',
                              fontSize: '11.5px',
                              fontWeight: 500,
                              ...(statusStyleMap[notification.status] || statusStyleMap['draft']),
                            }}
                          >
                            {notification.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Link
                              href={`/${notification.type}/${notification.id}`}
                              style={{
                                fontSize: '12.5px',
                                color: '#2A8A9E',
                                textDecoration: 'none',
                                fontWeight: 500,
                              }}
                            >
                              {notification.status === 'draft' ? 'Edit' : 'View'}
                            </Link>
                            {notification.status === 'draft' && (
                              <Link
                                href={`/${notification.type}/${notification.id}/preview`}
                                style={{
                                  fontSize: '12.5px',
                                  color: '#5A6478',
                                  textDecoration: 'none',
                                }}
                              >
                                Preview
                              </Link>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Sign Out */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, px: 3, py: 2, borderTop: '1px solid rgba(10,22,40,0.12)' }}>
            <Button onClick={handleLogout} fullWidth sx={{ fontSize: '13px', color: '#8B1A1A', border: '1px solid rgba(139,26,26,0.2)', borderRadius: '4px' }}>
              Sign Out
            </Button>
          </Box>
            </>
          )}

          {activeSideItem === 'Company Profile' && <CompanyProfile />}
          {activeSideItem === 'Contacts & HR' && <CompanyContacts />}

        </Box>
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            border: '1px solid rgba(10,22,40,0.12)',
            maxWidth: 400,
            width: '100%',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '22px', fontWeight: 500, color: '#0A1628' }}>
            New Submission
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#5A6478', mt: '4px' }}>
            Create a new JNF or INF form
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Type</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.type}
                  onChange={(e) => setNewFormData({ ...newFormData, type: e.target.value as 'jnf' | 'inf' })}
                  id="create-type"
                >
                  <MenuItem value="jnf">Job Notification Form (JNF)</MenuItem>
                  <MenuItem value="inf">Intern Notification Form (INF)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Season</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.season}
                  onChange={(e) => setNewFormData({ ...newFormData, season: e.target.value as number })}
                  id="create-season"
                >
                  <MenuItem value={1}>First Semester</MenuItem>
                  <MenuItem value={2}>Second Semester</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>Year</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newFormData.year}
                  onChange={(e) => setNewFormData({ ...newFormData, year: e.target.value as number })}
                  id="create-year"
                >
                  {[2025, 2026, 2027].map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            sx={{ fontSize: '13px', color: '#5A6478', border: '1px solid rgba(10,22,40,0.15)', borderRadius: '4px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createMutation.isPending}
            id="create-submit"
            sx={{
              bgcolor: '#0A1628',
              color: '#FEFEFE',
              fontSize: '13px',
              borderRadius: '4px',
              '&:hover': { bgcolor: '#2C3345' },
            }}
          >
            {createMutation.isPending ? <CircularProgress size={20} sx={{ color: '#FEFEFE' }} /> : 'Create →'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
