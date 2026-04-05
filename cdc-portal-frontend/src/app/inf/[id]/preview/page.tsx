'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Chip, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { notificationsApi } from '@/lib/api';
import Link from 'next/link';

const sectionBox = {
  bgcolor: '#FEFEFE', p: { xs: 3, md: 4 }, borderRadius: 2,
  boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid rgba(10,22,40,0.06)', mb: 3,
};
const sectionTitle = { fontFamily: '"EB Garamond", serif', fontSize: '20px', fontWeight: 500, color: '#0A1628', mb: 0.5 };
const fieldLabel = { fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '2px' };
const fieldValue = { fontSize: '14px', color: '#0A1628', mb: 1.5 };

function FieldDisplay({ label, value }: { label: string; value: any }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={fieldLabel}>{label}</Typography>
      {Array.isArray(value) ? (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {value.map((v, i) => <Chip key={i} label={v} size="small" sx={{ bgcolor: '#F4F6F9', border: '1px solid rgba(10,22,40,0.08)' }} />)}
        </Box>
      ) : (
        <Typography sx={fieldValue}>{value}</Typography>
      )}
    </Grid>
  );
}

export default function InfPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    notificationsApi.preview(id as any).then(res => {
      setData(res.data.preview);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [id]);

  const handleSubmit = async () => {
    try {
      await notificationsApi.submit(id as any);
      setSubmitted(true);
      setConfirmOpen(false);
    } catch (err: any) {
      setConfirmOpen(false);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Submission failed', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F6F9' }}><CircularProgress sx={{ color: '#1B5E6B' }} /></Box>;

  if (submitted) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F6F9' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(27,94,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <Typography sx={{ fontSize: '32px' }}>✓</Typography>
          </Box>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '32px', fontWeight: 500, color: '#0A1628', mb: 1 }}>INF Submitted Successfully</Typography>
          <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 1 }}>Your Intern Notification Form has been submitted for review.</Typography>
          <Box sx={{ bgcolor: '#F4F6F9', p: 2, borderRadius: 1, mb: 3, border: '1px solid rgba(10,22,40,0.06)' }}>
            <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>Reference Number</Typography>
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '18px', fontWeight: 600, color: '#0A1628' }}>{data?.reference_number}</Typography>
          </Box>
          <Typography sx={{ fontSize: '13px', color: '#5A6478', mb: 3 }}>A confirmation email has been sent. The CDC team will review your submission shortly.</Typography>
          <Button component={Link} href="/dashboard" variant="contained" sx={{ bgcolor: '#0A1628', '&:hover': { bgcolor: '#2C3345' }, px: 4 }}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  const ip = data?.intern_profile;
  const ec = data?.eligibility_criteria;
  const ss = data?.selection_stages || [];
  const si = data?.selection_infra;
  const dec = data?.declaration;
  const company = data?.company;
  const workModeLabel: Record<string, string> = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };
  const currencySymbol: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };
  const formatAmount = (val: any, currency?: string) => val ? `${currencySymbol[currency || 'INR'] || '₹'}${Number(val).toLocaleString('en-IN')}` : '—';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F9', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: '#0A1628', color: '#FEFEFE', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, fontFamily: '"EB Garamond", serif' }}>INF Preview</Typography>
          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: '"JetBrains Mono", monospace' }}>
            {data?.reference_number} · {data?.status?.replace('_', ' ')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} href={`/inf/${id}`}
            sx={{ color: '#FEFEFE', borderColor: 'rgba(255,255,255,0.3)', border: '1px solid', fontSize: '13px' }}>← Edit Form</Button>
          {data?.status === 'draft' && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained"
              sx={{ bgcolor: '#1B5E6B', color: '#FEFEFE', fontWeight: 600, '&:hover': { bgcolor: '#2A8A9E' } }}>Submit INF →</Button>
          )}
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 960 }}>

          {company && (
            <Box sx={sectionBox}>
              <Typography sx={sectionTitle}>Company Information</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <FieldDisplay label="Company Name" value={company.name} />
                <FieldDisplay label="Category" value={company.category} />
                <FieldDisplay label="Website" value={company.website} />
                <FieldDisplay label="Sector" value={company.sector} />
              </Grid>
            </Box>
          )}

          <Box sx={sectionBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={sectionTitle}>Intern Profile</Typography>
              <Button component={Link} href={`/inf/${id}`} size="small" sx={{ fontSize: '12px', color: '#2A8A9E' }}>Edit</Button>
            </Box>
            {ip ? (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <FieldDisplay label="Internship Title" value={ip.title} />
                <FieldDisplay label="Designation" value={ip.designation} />
                <FieldDisplay label="Place of Posting" value={ip.place_of_posting} />
                <FieldDisplay label="Work Mode" value={workModeLabel[ip.work_mode]} />
                <FieldDisplay label="Expected Hires" value={ip.expected_hires} />
                <FieldDisplay label="Duration" value={ip.expected_duration_months ? `${ip.expected_duration_months} months` : null} />
                <FieldDisplay label="PPO Provision" value={ip.ppo_provision ? 'Yes' : 'No'} />
                <FieldDisplay label="Required Skills" value={ip.required_skills} />
                <FieldDisplay label="Stipend" value={ip.stipend_amount ? formatAmount(ip.stipend_amount, ip.currency) + '/month' : null} />
                {ip.internship_description && (
                  <Grid item xs={12}>
                    <Typography sx={fieldLabel}>Description</Typography>
                    <Typography sx={{ ...fieldValue, whiteSpace: 'pre-wrap' }}>{ip.internship_description}</Typography>
                  </Grid>
                )}
              </Grid>
            ) : <Typography sx={{ color: '#5A6478', fontStyle: 'italic' }}>Not filled yet</Typography>}
          </Box>

          <Box sx={sectionBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={sectionTitle}>Eligibility & Courses</Typography>
              <Button component={Link} href={`/inf/${id}`} size="small" sx={{ fontSize: '12px', color: '#2A8A9E' }}>Edit</Button>
            </Box>
            {ec ? (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <FieldDisplay label="Min CGPA" value={ec.min_cgpa} />
                <FieldDisplay label="Backlogs Allowed" value={ec.backlogs_allowed ? 'Yes' : 'No'} />
                <FieldDisplay label="Gender Filter" value={ec.gender_filter === 'all' ? 'All' : ec.gender_filter} />
                {ec.programmes?.length > 0 && (
                  <Grid item xs={12}>
                    <Typography sx={fieldLabel}>Selected Programmes</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                      {ec.programmes.filter((p: any) => p.is_selected).map((p: any, i: number) => (
                        <Chip key={i} label={p.programme_name || p.programme_code} size="small" sx={{ bgcolor: 'rgba(27,94,107,0.1)', color: '#0A1628' }} />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            ) : <Typography sx={{ color: '#5A6478', fontStyle: 'italic' }}>Not filled yet</Typography>}
          </Box>

          <Box sx={sectionBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={sectionTitle}>Selection Process</Typography>
              <Button component={Link} href={`/inf/${id}`} size="small" sx={{ fontSize: '12px', color: '#2A8A9E' }}>Edit</Button>
            </Box>
            {ss.filter((s: any) => s.is_enabled).length > 0 ? ss.filter((s: any) => s.is_enabled).map((s: any, i: number) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, borderBottom: '1px solid rgba(10,22,40,0.06)' }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#1B5E6B', fontWeight: 600, minWidth: 24 }}>{i + 1}</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, flex: 1 }}>{s.stage_type}</Typography>
                <Chip label={s.stage_mode} size="small" sx={{ bgcolor: '#F4F6F9' }} />
                {s.duration_minutes > 0 && <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>{s.duration_minutes} min</Typography>}
              </Box>
            )) : <Typography sx={{ color: '#5A6478', fontStyle: 'italic' }}>Not filled yet</Typography>}
          </Box>

          <Box sx={sectionBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={sectionTitle}>Declaration</Typography>
              <Button component={Link} href={`/inf/${id}`} size="small" sx={{ fontSize: '12px', color: '#2A8A9E' }}>Edit</Button>
            </Box>
            {dec ? (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <FieldDisplay label="Signatory Name" value={dec.signatory_name} />
                <FieldDisplay label="Designation" value={dec.signatory_designation} />
                <FieldDisplay label="Typed Signature" value={dec.typed_signature} />
                <FieldDisplay label="All Declarations" value={dec.aipc_guidelines && dec.shortlisting_commitment && dec.accuracy_profile ? '✓ Complete' : '✗ Incomplete'} />
              </Grid>
            ) : <Typography sx={{ color: '#5A6478', fontStyle: 'italic' }}>Not filled yet</Typography>}
          </Box>
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"EB Garamond", serif', fontSize: '22px' }}>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#5A6478' }}>Once submitted, you won't be able to edit this INF. Are you sure?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#5A6478' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1B5E6B', color: '#FEFEFE', fontWeight: 600, '&:hover': { bgcolor: '#2A8A9E' } }}>
            Yes, Submit INF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
