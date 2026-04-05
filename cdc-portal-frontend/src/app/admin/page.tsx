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
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import { useAuth } from '@/lib/auth';
import { notificationsApi, adminApi } from '@/lib/api';
import { Notification } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

const statusStyleMap: Record<string, { bgcolor: string; color: string }> = {
  draft: { bgcolor: 'rgba(90,100,120,0.1)', color: '#5A6478' },
  submitted: { bgcolor: 'rgba(27,94,107,0.1)', color: '#1B5E6B' },
  under_review: { bgcolor: 'rgba(200,146,42,0.15)', color: '#8B6000' },
  approved: { bgcolor: 'rgba(34,100,60,0.1)', color: '#1d6b3a' },
  rejected: { bgcolor: 'rgba(139,26,26,0.1)', color: '#8B1A1A' },
  changes_requested: { bgcolor: 'rgba(139,26,26,0.1)', color: '#8B1A1A' },
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeSideItem, setActiveSideItem] = useState('Submissions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const isSuperAdmin = user?.role === 'super_admin';

  const { data: notificationsData, isLoading: loadingNotifications } = useQuery({
    queryKey: ['admin-notifications', statusFilter, typeFilter],
    queryFn: async () => adminApi.listNotifications({ status: statusFilter !== 'all' ? statusFilter : undefined, type: typeFilter !== 'all' ? typeFilter : undefined }),
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => adminApi.listUsers(),
    enabled: isSuperAdmin && activeSideItem === 'Recruiters',
  });

  const { data: analyticsData, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => adminApi.getAnalytics(),
    enabled: activeSideItem === 'Analytics',
  });

  const { data: auditLogsData, isLoading: loadingLogs } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => adminApi.getAuditLogs(),
    enabled: isSuperAdmin && activeSideItem === 'Audit Log',
  });

  const notifications: Notification[] = notificationsData?.data?.data || [];
  const users = usersData?.data?.data || [];
  const analytics = analyticsData?.data || {};
  const auditLogs = auditLogsData?.data?.data || [];

  const sidebarItems = isSuperAdmin ? [
    { label: 'Submissions' },
    { label: 'Recruiters' },
    { label: 'Analytics' },
    { label: 'Audit Log' },
    { label: 'Export Data' },
  ] : [
    { label: 'Submissions' },
    { label: 'Analytics' },
    { label: 'Export Data' },
  ];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, review_notes }: { id: number; status: string; review_notes?: string }) =>
      adminApi.updateNotificationStatus(id, { status, review_notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      setStatusDialogOpen(false);
      setSelectedNotification(null);
      setNewStatus('');
      setReviewNotes('');
    },
  });

  const handleStatusUpdate = () => {
    if (selectedNotification && newStatus) {
      updateStatusMutation.mutate({
        id: selectedNotification.id,
        status: newStatus,
        review_notes: reviewNotes || undefined,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const openStatusDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setNewStatus(notification.status);
    setReviewNotes(notification.review_notes || '');
    setStatusDialogOpen(true);
  };

  const filteredNotifications = notifications;

  const handleExport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export?type=${typeFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

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
          <Box sx={{ px: 2, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', mb: 1.5 }}>
            <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '15px', color: '#FEFEFE', fontWeight: 500 }}>
              CDC Portal
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
            </Typography>
          </Box>

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

          <Box sx={{ mt: 'auto' }}>
            <Box
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                px: 2,
                py: '9px',
                fontSize: '13px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)',
                '&:hover': { color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.6, flexShrink: 0 }} />
              Sign Out
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#FEFEFE' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(10,22,40,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>
                {activeSideItem}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mt: '2px' }}>
                CDC Admin Dashboard · {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </Typography>
            </Box>
          </Box>

          {/* Submissions View */}
          {activeSideItem === 'Submissions' && (
            <>
              <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, borderBottom: '1px solid rgba(10,22,40,0.12)' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="submitted">Submitted</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="changes_requested">Changes Requested</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Type</InputLabel>
                  <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="jnf">JNF</MenuItem>
                    <MenuItem value="inf">INF</MenuItem>
                  </Select>
                </FormControl>
                <Button size="small" variant="outlined" onClick={handleExport}>Export CSV</Button>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
                <TableContainer>
                  <Table sx={{ '& td, & th': { borderBottomColor: 'rgba(10,22,40,0.08)' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Reference</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Season</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Submitted</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loadingNotifications ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                            <CircularProgress size={28} />
                          </TableCell>
                        </TableRow>
                      ) : filteredNotifications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ color: '#5A6478' }}>No submissions found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotifications.map((n) => (
                          <TableRow key={n.id} sx={{ '&:hover td': { bgcolor: '#F4F6F9' } }}>
                            <TableCell sx={{ fontWeight: 500, fontSize: '13px' }}>{n.company?.name || '—'}</TableCell>
                            <TableCell>
                              <Chip label={n.type.toUpperCase()} size="small" sx={{ fontSize: '10px', fontWeight: 600 }} />
                            </TableCell>
                            <TableCell sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>{n.reference_number}</TableCell>
                            <TableCell sx={{ fontSize: '12px' }}>{n.year} - {n.season === 1 ? 'First' : 'Second'}</TableCell>
                            <TableCell sx={{ fontSize: '12px' }}>{n.submitted_at ? new Date(n.submitted_at).toLocaleDateString() : '—'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={n.status.replace('_', ' ')} 
                                size="small"
                                sx={{ 
                                  fontSize: '10px', 
                                  bgcolor: statusStyleMap[n.status]?.bgcolor || '#eee',
                                  color: statusStyleMap[n.status]?.color || '#666',
                                }} 
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="small" onClick={() => openStatusDialog(n)}>Update</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}

          {/* Recruiters View - Super Admin Only */}
          {activeSideItem === 'Recruiters' && isSuperAdmin && (
            <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingUsers ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center' }}><CircularProgress /></TableCell></TableRow>
                    ) : users.length === 0 ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center' }}>No recruiters</TableCell></TableRow>
                    ) : (
                      users.map((u: any) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.company?.name || '—'}</TableCell>
                          <TableCell><Chip label={u.role} size="small" /></TableCell>
                          <TableCell><Chip label={u.is_active ? 'Active' : 'Inactive'} size="small" color={u.is_active ? 'success' : 'default'} /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Analytics View */}
          {activeSideItem === 'Analytics' && (
            <Box sx={{ p: 3 }}>
              {loadingAnalytics ? <CircularProgress /> : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  <Box sx={{ bgcolor: '#F4F6F9', p: 2, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>{analytics.total_submissions || 0}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>Total Submissions</Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#F4F6F9', p: 2, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>{analytics.by_type?.jnf || 0}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>JNF</Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#F4F6F9', p: 2, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>{analytics.by_type?.inf || 0}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>INF</Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#F4F6F9', p: 2, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>{analytics.by_status?.approved || 0}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>Approved</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Audit Log - Super Admin Only */}
          {activeSideItem === 'Audit Log' && isSuperAdmin && (
            <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Entity</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '11px', color: '#5A6478' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingLogs ? (
                      <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center' }}><CircularProgress /></TableCell></TableRow>
                    ) : auditLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center' }}>No logs</TableCell></TableRow>
                    ) : (
                      auditLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.user?.name || '—'}</TableCell>
                          <TableCell><Chip label={log.action} size="small" /></TableCell>
                          <TableCell>{log.entity_type} #{log.entity_id}</TableCell>
                          <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Export Data */}
          {activeSideItem === 'Export Data' && (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ mb: 2 }}>Export Submissions</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleExport}>Download CSV</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} label="Status">
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approve</MenuItem>
                <MenuItem value="rejected">Reject</MenuItem>
                <MenuItem value="changes_requested">Request Changes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Review Notes (optional)"
              multiline
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}