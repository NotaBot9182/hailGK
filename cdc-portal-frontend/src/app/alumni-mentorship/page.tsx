'use client';

import { useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, Grid, Snackbar, Divider, Select, MenuItem, OutlinedInput, Chip, FormControl } from '@mui/material';
import Link from 'next/link';
import { alumniApi } from '@/lib/api';

const PROGRAM_TITLES = [
  'B.Tech / B.E (Bachelor of Technology / Engineering)',
  'M.Tech (Master of Technology)',
  'M.Sc (Master of Science)',
  'M.A (Master of Arts)',
  'MBA (Master of Business Administration)',
  'Executive MBA',
  'MBA (Business Analytics)',
  'Dual Degree',
  'Integrated M.Sc & M.Tech'
];

function Field({ label, value, onChange, placeholder = "", multiline = false, rows = 1, type = "text" }: any) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#5A6478', mb: 0.5 }}>{label}</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#FFF',
            fontSize: '15px',
            borderLeft: `3px solid #0A1628`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            '& fieldset': { borderColor: 'rgba(10, 22, 40, 0.15)' },
            '&:hover fieldset': { borderColor: '#1B5E6B' },
            '&.Mui-focused fieldset': { borderColor: '#0A1628', borderWidth: '1px' },
          }
        }}
      />
    </Box>
  );
}

export default function AlumniMentorshipForm() {
  const [formData, setFormData] = useState<any>({
    affiliated_degrees: [],
    mentorship_areas: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDegreeChange = (event: any) => {
    const { target: { value } } = event;
    handleChange('affiliated_degrees', typeof value === 'string' ? value.split(',') : value);
  };

  const toggleMentorshipArea = (area: string) => {
    const current = formData?.mentorship_areas || [];
    if (current.includes(area)) {
      handleChange('mentorship_areas', current.filter((a: string) => a !== area));
    } else {
      handleChange('mentorship_areas', [...current, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await alumniApi.submitMentorshipForm({
        ...formData,
        grad_year: formData.grad_year ? parseInt(formData.grad_year) : null
      });
      setSnackbar({ open: true, message: 'Mentorship Application submitted successfully!', severity: 'success' });
      // Reset form on success
      setFormData({ affiliated_degrees: [], mentorship_areas: [], name: '', email: '', phone: '', grad_year: '', company: '', designation: '', industry: '', linkedin: '', motivation: '' });
    } catch (error: any) {
      console.error('Submission error:', error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit application. Please check your inputs.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F9', pb: 10 }}>
      {/* ─── TOP STRIP ─── */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.7)', fontSize: '12px', px: '2rem', py: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.02em' }}>
        <span>Indian Institute of Technology (ISM) Dhanbad — Alumni Network</span>
        <Box component={Link} href="/" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#E8B64A' } }}>Back to Portal</Box>
      </Box>

      {/* ─── NAVBAR ─── */}
      <Box sx={{ bgcolor: '#FEFEFE', borderBottom: '1px solid rgba(10,22,40,0.12)', px: '2rem', display: 'flex', alignItems: 'center', height: '68px' }}>
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 48, height: 48, objectFit: 'contain' }} />
          <Box>
            <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '17px', fontWeight: 600, color: '#0A1628', lineHeight: 1.2, whiteSpace: 'nowrap' }}>IIT (ISM) Dhanbad</Typography>
            <Typography sx={{ fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Alumni Mentorship Network</Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── FORM CONTENT ─── */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: '1.5rem', mt: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '32px', fontWeight: 600, color: '#0A1628' }}>
            Alumni Mentorship Application
          </Typography>
          <Typography sx={{ fontSize: '15px', color: '#5A6478', mt: 1 }}>
            Join the IIT (ISM) alumni network to help mentor current students and recent graduates. 
            Share your expertise, provide industry insights, and guide the next generation of engineers and leaders.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#FEFEFE', borderRadius: '8px', border: '1px solid rgba(10,22,40,0.12)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(10,22,40,0.04)' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              
              {/* Personal Information */}
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1B5E6B', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field label="Full Name *" value={formData.name} onChange={(v: string) => handleChange('name', v)} placeholder="John Doe" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="Graduation Year *" value={formData.grad_year} onChange={(v: string) => handleChange('grad_year', v)} placeholder="e.g. 2014" type="number" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="Email Address *" value={formData.email} onChange={(v: string) => handleChange('email', v)} placeholder="john@example.com" type="email" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="Phone Number" value={formData.phone} onChange={(v: string) => handleChange('phone', v)} placeholder="+91 xxxx xxxx" />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Degrees Section */}
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1B5E6B', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Your IIT (ISM) Affiliations (Degrees)
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 3 }}>
                  Please select the degree programmes you graduated from or are interested in mentoring.
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#5A6478', mb: 0.5 }}>Select Degrees</Typography>
                  <Select
                    multiple
                    displayEmpty
                    value={formData.affiliated_degrees || []}
                    onChange={handleDegreeChange}
                    input={<OutlinedInput sx={{
                      bgcolor: '#FFF',
                      fontSize: '15px',
                      borderLeft: `3px solid #0A1628`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(10, 22, 40, 0.15)' },
                      '&:hover fieldset': { borderColor: '#1B5E6B' },
                      '&.Mui-focused fieldset': { borderColor: '#0A1628', borderWidth: '1px' },
                    }}/>}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <span style={{ color: '#9CA3AF' }}>Select degree programmes...</span>;
                      }
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value: string) => (
                            <Chip key={value} label={value} size="small" sx={{ bgcolor: 'rgba(10,22,40,0.06)', borderRadius: '4px' }} />
                          ))}
                        </Box>
                      );
                    }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                  >
                    <MenuItem disabled value="">
                      <em>Select degree programmes...</em>
                    </MenuItem>
                    {PROGRAM_TITLES.map((title) => (
                      <MenuItem key={title} value={title} sx={{ fontSize: '14.5px' }}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Professional Details */}
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1B5E6B', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Professional Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field label="Current Organization" value={formData.company} onChange={(v: string) => handleChange('company', v)} placeholder="Company Name" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="Current Designation" value={formData.designation} onChange={(v: string) => handleChange('designation', v)} placeholder="e.g. Senior Staff Engineer" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="Industry/Domain" value={formData.industry} onChange={(v: string) => handleChange('industry', v)} placeholder="e.g. FinTech, Energy" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field label="LinkedIn Profile" value={formData.linkedin} onChange={(v: string) => handleChange('linkedin', v)} placeholder="https://linkedin.com/in/..." />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Mentorship Preferences */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1B5E6B', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Mentorship Preferences
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 2 }}>Select the areas where you feel comfortable mentoring students:</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {['Career Guidance', 'Mock Interviews', 'Resume Review', 'Higher Education Abroad', 'Startup / Entrepreneurship', 'Domain Expertise', 'Research & Academia'].map((area) => {
                    const selected = formData.mentorship_areas?.includes(area);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={area}>
                        <Box
                          onClick={() => toggleMentorshipArea(area)}
                          sx={{ p: 1.5, border: '1px solid', borderColor: selected ? '#1B5E6B' : 'rgba(10,22,40,0.12)', borderRadius: '6px', bgcolor: selected ? 'rgba(27,94,107,0.06)' : '#FFF', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 1.5 }}
                        >
                          <Checkbox size="small" checked={selected} sx={{ p: 0, color: 'rgba(10,22,40,0.2)', '&.Mui-checked': { color: '#1B5E6B' } }} />
                          <Typography sx={{ fontSize: '13.5px', fontWeight: selected ? 600 : 400, color: selected ? '#1B5E6B' : '#0A1628' }}>{area}</Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                
                <Field label="Additional Information / Motivation" value={formData.motivation} onChange={(v: string) => handleChange('motivation', v)} placeholder="Briefly describe why you want to mentor and any specific preferences you have..." multiline rows={3} />
              </Box>

            </Box>

            {/* Form Footer */}
            <Box sx={{ bgcolor: '#F9FAFB', p: { xs: 3, md: 4 }, borderTop: '1px solid rgba(10,22,40,0.08)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mr: 3 }}>* Fields are required</Typography>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.grad_year}
                sx={{ 
                  bgcolor: '#C8922A', 
                  color: '#0A1628', 
                  fontWeight: 600, 
                  px: '36px', 
                  py: '12px', 
                  fontSize: '15px', 
                  borderRadius: '6px', 
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#E8B64A' },
                  '&.Mui-disabled': { bgcolor: '#E8EBF0', color: '#A0AABF' }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { 
            bgcolor: snackbar.severity === 'error' ? '#D32F2F' : '#2E7D32',
            color: '#FFF',
            fontWeight: 500
          }
        }}
      />
    </Box>
  );
}
