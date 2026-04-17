'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, CircularProgress, Chip,
  Table, TableBody, TableRow, TableCell, IconButton,
  Alert, LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { notificationsApi } from '@/lib/api';

type ParseType = 'jnf' | 'inf' | 'company';

interface AiParsePdfDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: Record<string, any>) => void;
  type: ParseType;
}

const TYPE_LABELS: Record<ParseType, string> = {
  jnf: 'Job Notification Form',
  inf: 'Internship Notification Form',
  company: 'Company Profile',
};

const FIELD_LABELS: Record<string, string> = {
  // JNF
  job_title: 'Job Title',
  job_designation: 'Designation',
  place_of_posting: 'Place of Posting',
  work_location_mode: 'Work Mode',
  expected_hires: 'Expected Hires',
  job_description: 'Job Description',
  required_skills: 'Required Skills',
  min_cpi: 'Minimum CPI',
  backlogs_allowed: 'Backlogs Allowed',
  gender_filter: 'Gender Filter',
  ctc_btech: 'CTC – B.Tech (LPA)',
  ctc_mtech: 'CTC – M.Tech (LPA)',
  ctc_mba: 'CTC – MBA (LPA)',
  ctc_msc: 'CTC – M.Sc (LPA)',
  ctc_phd: 'CTC – Ph.D (LPA)',
  base_salary: 'Base Salary (LPA)',
  gross_salary: 'Gross Salary (LPA)',
  take_home_monthly: 'Take-Home Monthly (₹)',
  joining_bonus: 'Joining Bonus (₹)',
  performance_bonus: 'Performance Bonus',
  retention_bonus: 'Retention Bonus (₹)',
  relocation_allowance: 'Relocation Allowance (₹)',
  bond_details: 'Bond Details',
  tentative_joining_month: 'Joining Month',
  // INF
  intern_title: 'Internship Title',
  intern_designation: 'Designation',
  expected_duration_months: 'Duration (months)',
  ppo_provision: 'PPO Provision',
  internship_description: 'Internship Description',
  stipend_btech: 'Stipend – B.Tech (₹/mo)',
  stipend_mtech: 'Stipend – M.Tech (₹/mo)',
  stipend_mba: 'Stipend – MBA (₹/mo)',
  stipend_msc: 'Stipend – M.Sc (₹/mo)',
  stipend_phd: 'Stipend – Ph.D (₹/mo)',
  // Company
  name: 'Company Name',
  category: 'Category',
  website: 'Website',
  postal_address: 'Postal Address',
  sector: 'Sector',
  industry_sector_tags: 'Industry Tags',
  nature_of_business: 'Nature of Business',
  no_of_employees: 'No. of Employees',
  annual_turnover: 'Annual Turnover',
  date_of_establishment: 'Year Founded',
  linkedin_url: 'LinkedIn URL',
  parent_hq_country: 'Parent HQ Country',
  parent_hq_city: 'Parent HQ City',
  description: 'Company Description',
};

function formatValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—';
  return String(val);
}

export default function AiParsePdfDialog({ open, onClose, onApply, type }: AiParsePdfDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10 MB.');
      return;
    }
    setError(null);
    setParsedData(null);
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleParse = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setParsedData(null);
    setProgress(0);

    // Fake progress animation while waiting for AI
    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 8 : p));
    }, 400);

    try {
      const res = await notificationsApi.aiParsePdf(file, type);
      setProgress(100);
      setParsedData(res.data.data);
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 429) {
        setError(
          '⚠️ Gemini API quota exceeded. Please generate a new free API key at aistudio.google.com, ' +
          'then update GEMINI_API_KEY in the .env file and restart the API server.'
        );
      } else {
        setError(msg || 'Failed to parse PDF. Please try again or fill manually.');
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (parsedData) {
      onApply(parsedData);
      handleClose();
    }
  };

  // Only show rows with non-null values
  const previewRows = parsedData
    ? Object.entries(parsedData).filter(([, v]) => v !== null && v !== undefined && v !== '')
    : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(10,22,40,0.15)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: '#0A1628', color: '#FEFEFE', px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#C8922A', fontSize: 22 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.01em' }}>
              AI Auto-Fill
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', mt: 0.25 }}>
              {TYPE_LABELS[type]}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Step 1 — Upload zone */}
          {!parsedData && (
            <>
              <Box
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: `2px dashed ${dragging ? '#C8922A' : file ? '#10B981' : 'rgba(10,22,40,0.15)'}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: dragging ? 'rgba(200,146,42,0.04)' : file ? 'rgba(16,185,129,0.04)' : 'rgba(244,246,249,0.6)',
                  transition: 'all 0.25s',
                  '&:hover': { borderColor: '#C8922A', bgcolor: 'rgba(200,146,42,0.04)' },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                {file ? (
                  <>
                    <CheckCircleIcon sx={{ color: '#10B981', fontSize: 36, mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>
                      {file.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5A6478', mt: 0.5 }}>
                      {(file.size / 1024).toFixed(0)} KB · Click to change
                    </Typography>
                  </>
                ) : (
                  <>
                    <UploadFileIcon sx={{ color: '#A0AABF', fontSize: 40, mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '14px' }}>
                      Drop your PDF here, or click to browse
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#94A3B8', mt: 0.5 }}>
                      Company brochure, JD, or any document · Max 10 MB
                    </Typography>
                  </>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }}>
                  {error}
                </Alert>
              )}

              {/* Loading state */}
              {loading && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: '#5A6478', fontWeight: 500 }}>
                      Gemini is reading the document…
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#C8922A', fontWeight: 600 }}>
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(200,146,42,0.1)',
                      '& .MuiLinearProgress-bar': { bgcolor: '#C8922A', borderRadius: 3 },
                    }}
                  />
                  <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 1, textAlign: 'center' }}>
                    This may take 10–30 seconds depending on document length
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Step 2 — Results preview */}
          {parsedData && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: '#0A1628', fontSize: '14px' }}>
                  AI found {previewRows.length} field{previewRows.length !== 1 ? 's' : ''}
                </Typography>
                <Chip
                  label={`from "${file?.name}"`}
                  size="small"
                  sx={{ fontSize: '11px', bgcolor: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
                />
              </Box>

              <Box sx={{ maxHeight: 340, overflowY: 'auto', border: '1px solid rgba(10,22,40,0.08)', borderRadius: 1.5 }}>
                <Table size="small">
                  <TableBody>
                    {previewRows.map(([key, val]) => (
                      <TableRow
                        key={key}
                        sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(200,146,42,0.03)' } }}
                      >
                        <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#5A6478', width: '40%', py: 1.25, borderColor: 'rgba(10,22,40,0.06)' }}>
                          {FIELD_LABELS[key] || key}
                        </TableCell>
                        <TableCell sx={{ fontSize: '13px', color: '#0A1628', py: 1.25, borderColor: 'rgba(10,22,40,0.06)' }}>
                          {formatValue(val)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Alert severity="info" sx={{ mt: 2, fontSize: '12px' }}>
                Review the extracted values above. Click <strong>Apply to Form</strong> to pre-fill the form — you can still edit everything before saving.
              </Alert>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(10,22,40,0.07)', gap: 1.5, justifyContent: 'space-between' }}>
        <Button
          onClick={parsedData ? () => { setParsedData(null); setFile(null); } : handleClose}
          sx={{ color: '#5A6478', fontSize: '13px', fontWeight: 500 }}
        >
          {parsedData ? '← Try Another File' : 'Cancel'}
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {!parsedData && (
            <Button
              variant="contained"
              disabled={!file || loading}
              onClick={handleParse}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{
                bgcolor: '#C8922A',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                px: 3,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#B07A20', boxShadow: 'none' },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              {loading ? 'Parsing…' : 'Parse with AI'}
            </Button>
          )}
          {parsedData && (
            <Button
              variant="contained"
              onClick={handleApply}
              startIcon={<CheckCircleIcon />}
              sx={{
                bgcolor: '#0A1628',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                px: 3,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1a2d4a', boxShadow: 'none' },
              }}
            >
              Apply to Form
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
