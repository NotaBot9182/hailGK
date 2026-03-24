'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const steps = ['Email Verification', 'Recruiter Details', 'Company Profile'];

const companyCategories = ['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO'];
const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
const turnoverRanges = ['Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr'];

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    designation: '',
    mobile: '',
    alt_mobile: '',
    password: '',
    password_confirmation: '',
    company_name: '',
    company_category: '',
    company_website: '',
    company_address: '',
    company_sector: '',
    company_nature: '',
    company_employees: '',
    company_establishment: '',
    company_turnover: '',
    linkedin_url: '',
    parent_hq_country: '',
    parent_hq_city: '',
    industry_tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.industry_tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        industry_tags: [...formData.industry_tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      industry_tags: formData.industry_tags.filter((t) => t !== tag),
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.sendOtp(formData.email);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOtp(formData.email, formData.otp);
      setVerificationToken(response.data.verification_token);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        verification_token: verificationToken,
        ...formData,
      });

      const { token, user, company } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      if (company) {
        localStorage.setItem('auth_company', JSON.stringify(company));
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Company Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={verificationToken !== ''}
              helperText="Use your official company email address"
            />
            <Button
              variant="outlined"
              onClick={handleSendOtp}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>

            {verificationToken && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  OTP sent successfully! Check your email.
                </Alert>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange('otp')}
                  inputProps={{ maxLength: 6 }}
                  placeholder="Enter 6-digit code"
                />
                <Button
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={loading || formData.otp.length !== 6}
                  sx={{ mt: 2 }}
                  endIcon={<ArrowForwardIcon />}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Proceed'}
                </Button>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField fullWidth label="Full Name" value={formData.name} onChange={handleChange('name')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Designation" value={formData.designation} onChange={handleChange('designation')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Mobile (+91)" value={formData.mobile} onChange={handleChange('mobile')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Alternative Mobile" value={formData.alt_mobile} onChange={handleChange('alt_mobile')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Confirm Password" type="password" value={formData.password_confirmation} onChange={handleChange('password_confirmation')} required />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>Back</Button>
              <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}>Next</Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField fullWidth label="Company Name" value={formData.company_name} onChange={handleChange('company_name')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select value={formData.company_category} onChange={handleSelectChange('company_category')} label="Category">
                    {companyCategories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Website" value={formData.company_website} onChange={handleChange('company_website')} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Postal Address" multiline rows={2} value={formData.company_address} onChange={handleChange('company_address')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Sector" value={formData.company_sector} onChange={handleChange('company_sector')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Nature of Business" value={formData.company_nature} onChange={handleChange('company_nature')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>No. of Employees</InputLabel>
                  <Select value={formData.company_employees} onChange={handleSelectChange('company_employees')} label="No. of Employees">
                    {employeeRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Date of Establishment" type="date" value={formData.company_establishment} onChange={handleChange('company_establishment')} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Annual Turnover (NIRF)</InputLabel>
                  <Select value={formData.company_turnover} onChange={handleSelectChange('company_turnover')} label="Annual Turnover (NIRF)">
                    {turnoverRanges.map((range) => <MenuItem key={range} value={range}>{range}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="LinkedIn URL" value={formData.linkedin_url} onChange={handleChange('linkedin_url')} />
              </Grid>
              {formData.company_category === 'MNC' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Parent HQ Country" value={formData.parent_hq_country} onChange={handleChange('parent_hq_country')} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Parent HQ City" value={formData.parent_hq_city} onChange={handleChange('parent_hq_city')} required />
                  </Grid>
                </>
              )}
              <Grid size={12}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField label="Industry Tags" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                  <Button variant="outlined" onClick={handleAddTag}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.industry_tags.map((tag) => <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />)}
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>Back</Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Back to Home</Button>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Recruiter Registration</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>Join the CDC Portal for campus recruitment</Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

          {renderStepContent(activeStep)}
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Already registered?{' '}
          <Link href="/login" style={{ color: '#1B459C' }}>Login here</Link>
        </Typography>
      </Container>
    </Box>
  );
}
