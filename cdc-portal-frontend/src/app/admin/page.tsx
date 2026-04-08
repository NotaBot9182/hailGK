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
  Checkbox,
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const handleExport = async (exportType: 'all' | 'selected' | 'filtered' = 'filtered') => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/export?type=${typeFilter !== 'all' ? typeFilter : ''}`;
      if (exportType === 'selected' && selectedIds.length > 0) {
        url += `&ids=${selectedIds.join(',')}`;
      }
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
      });
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${exportType === 'selected' ? 'selected' : 'notifications'}-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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
              <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, borderBottom: '1px solid rgba(10,22,40,0.12)', alignItems: 'center', flexWrap: 'wrap' }}>
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
                <Box sx={{ flex: 1 }} />
                {selectedIds.length > 0 && (
                  <Chip label={`${selectedIds.length} selected`} size="small" onDelete={() => setSelectedIds([])} 
                    sx={{ bgcolor: 'rgba(200,146,42,0.15)', color: '#8B6000', fontWeight: 600 }} />
                )}
                <Button size="small" variant="outlined" onClick={() => handleExport(selectedIds.length > 0 ? 'selected' : 'filtered')}
                  sx={{ borderColor: '#0A1628', color: '#0A1628', fontWeight: 500, fontSize: '12px' }}>
                  {selectedIds.length > 0 ? `Export Selected (${selectedIds.length})` : 'Export All CSV'}
                </Button>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
                <TableContainer>
                  <Table sx={{ '& td, & th': { borderBottomColor: 'rgba(10,22,40,0.08)' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox size="small" checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                            indeterminate={selectedIds.length > 0 && selectedIds.length < filteredNotifications.length}
                            onChange={toggleSelectAll}
                            sx={{ color: '#5A6478', '&.Mui-checked': { color: '#C8922A' }, '&.MuiCheckbox-indeterminate': { color: '#C8922A' } }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Reference</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Season</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Submitted</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loadingNotifications ? (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                            <CircularProgress size={28} />
                          </TableCell>
                        </TableRow>
                      ) : filteredNotifications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ color: '#5A6478' }}>No submissions found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotifications.map((n) => (
                          <TableRow key={n.id} sx={{ '&:hover td': { bgcolor: '#F4F6F9' }, bgcolor: selectedIds.includes(n.id) ? 'rgba(200,146,42,0.04)' : 'transparent' }}>
                            <TableCell padding="checkbox">
                              <Checkbox size="small" checked={selectedIds.includes(n.id)} onChange={() => toggleSelect(n.id)}
                                sx={{ color: '#5A6478', '&.Mui-checked': { color: '#C8922A' } }} />
                            </TableCell>
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
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Link href={`/${n.type}/${n.id}`} style={{ textDecoration: 'none' }}>
                                  <Button size="small" variant="outlined" sx={{ fontSize: '11px', minWidth: 0, px: 1.5, borderColor: '#0A1628', color: '#0A1628' }}>View</Button>
                                </Link>
                                <Button size="small" onClick={() => openStatusDialog(n)} sx={{ fontSize: '11px', minWidth: 0, px: 1.5 }}>Update</Button>
                              </Box>
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
                <Table sx={{ '& td, & th': { borderBottomColor: 'rgba(10,22,40,0.08)' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Admin</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Target (JNF/INF)</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Details</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '11px', color: '#5A6478', textTransform: 'uppercase' }}>Date & Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingLogs ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                    ) : auditLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>No audit logs found</TableCell></TableRow>
                    ) : (
                      auditLogs.map((log: any) => {
                        const meta = log.metadata || {};
                        const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
                          'status_update': { label: 'Status Update', color: '#1B5E6B', bg: 'rgba(27,94,107,0.1)' },
                          'user_update': { label: 'User Modified', color: '#8B6000', bg: 'rgba(200,146,42,0.15)' },
                          'user_delete': { label: 'User Deleted', color: '#8B1A1A', bg: 'rgba(139,26,26,0.1)' },
                          'user_create': { label: 'User Created', color: '#1d6b3a', bg: 'rgba(34,100,60,0.1)' },
                        };
                        const actionStyle = actionLabels[log.action] || { label: log.action, color: '#5A6478', bg: '#eee' };

                        return (
                          <TableRow key={log.id} sx={{ '&:hover td': { bgcolor: '#F4F6F9' } }}>
                            {/* Admin who performed the action */}
                            <TableCell>
                              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#0A1628' }}>{log.user?.name || '—'}</Typography>
                              <Typography sx={{ fontSize: '11px', color: '#5A6478' }}>{log.user?.email || ''}</Typography>
                            </TableCell>

                            {/* Action type */}
                            <TableCell>
                              <Chip label={actionStyle.label} size="small"
                                sx={{ fontSize: '10px', fontWeight: 600, bgcolor: actionStyle.bg, color: actionStyle.color }} />
                            </TableCell>

                            {/* Target - which JNF/INF */}
                            <TableCell>
                              {log.entity_type === 'notification' ? (
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label={meta.notification_type || 'N/A'} size="small"
                                      sx={{ fontSize: '10px', fontWeight: 700, bgcolor: (meta.notification_type === 'JNF') ? 'rgba(27,94,107,0.1)' : 'rgba(200,146,42,0.15)', color: (meta.notification_type === 'JNF') ? '#1B5E6B' : '#8B6000' }} />
                                    <Typography sx={{ fontSize: '12px', fontFamily: '"JetBrains Mono", monospace', color: '#0A1628' }}>
                                      {meta.reference_number || `#${log.entity_id}`}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                                    {(meta.company_name || log.notification_company) && (
                                      <Typography sx={{ fontSize: '11px', color: '#5A6478' }}>{meta.company_name || log.notification_company}</Typography>
                                    )}
                                    {log.notification_current_status && (
                                      <Chip
                                        label={`Currently: ${log.notification_current_status.replace('_', ' ')}`}
                                        size="small"
                                        sx={{
                                          fontSize: '9px', fontWeight: 600, height: 18,
                                          ...(statusStyleMap[log.notification_current_status] || { bgcolor: '#eee', color: '#666' })
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              ) : (
                                <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>
                                  {log.entity_type} #{log.entity_id}
                                  {meta.email && <span style={{ marginLeft: 6 }}>({meta.email})</span>}
                                  {meta.deleted_user_email && <span style={{ marginLeft: 6 }}>({meta.deleted_user_email})</span>}
                                </Typography>
                              )}
                            </TableCell>

                            {/* Details - status change, metadata */}
                            <TableCell>
                              {log.action === 'status_update' && meta.old_status && meta.new_status ? (
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Chip label={meta.old_status.replace('_', ' ')} size="small"
                                      sx={{ fontSize: '10px', ...(statusStyleMap[meta.old_status] || { bgcolor: '#eee', color: '#666' }) }} />
                                    <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>→</Typography>
                                    <Chip label={meta.new_status.replace('_', ' ')} size="small"
                                      sx={{ fontSize: '10px', fontWeight: 600, ...(statusStyleMap[meta.new_status] || { bgcolor: '#eee', color: '#666' }) }} />
                                  </Box>
                                  {meta.review_notes && (
                                    <Typography sx={{ fontSize: '11px', color: '#5A6478', mt: 0.5, fontStyle: 'italic' }}>
                                      "{meta.review_notes.substring(0, 80)}{meta.review_notes.length > 80 ? '...' : ''}"
                                    </Typography>
                                  )}
                                </Box>
                              ) : log.action === 'user_update' ? (
                                <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>
                                  {meta.role && `Role: ${meta.role}`}
                                  {meta.is_active !== undefined && ` · ${meta.is_active ? 'Activated' : 'Deactivated'}`}
                                </Typography>
                              ) : (
                                <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>—</Typography>
                              )}
                            </TableCell>

                            {/* Timestamp */}
                            <TableCell>
                              <Typography sx={{ fontSize: '12px', color: '#0A1628' }}>
                                {new Date(log.created_at).toLocaleDateString()}
                              </Typography>
                              <Typography sx={{ fontSize: '11px', color: '#5A6478' }}>
                                {new Date(log.created_at).toLocaleTimeString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Export Data */}
          {activeSideItem === 'Export Data' && (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 3, color: '#0A1628' }}>Export Submissions</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={() => handleExport('filtered')}
                  sx={{ bgcolor: '#0A1628', '&:hover': { bgcolor: '#2C3345' } }}>Export All (CSV)</Button>
                <Button variant="outlined" onClick={async () => {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export?type=jnf`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
                  });
                  const blob = await response.blob();
                  const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob);
                  a.download = `jnf-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                }} sx={{ borderColor: '#1B5E6B', color: '#1B5E6B' }}>Export JNF Only</Button>
                <Button variant="outlined" onClick={async () => {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export?type=inf`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
                  });
                  const blob = await response.blob();
                  const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob);
                  a.download = `inf-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                }} sx={{ borderColor: '#8B6000', color: '#8B6000' }}>Export INF Only</Button>
              </Box>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mt: 2 }}>
                Tip: Use the Submissions tab to select specific rows and export only those.
              </Typography>
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