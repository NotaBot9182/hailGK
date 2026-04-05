'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { companyApi } from '@/lib/api';
import { Company } from '@/types';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const companyCategories = ['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO'];
const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
const turnoverRanges = ['Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr'];

export default function CompanyProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTag, setNewTag] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCompany();
  }, [isAuthenticated, router]);

  const fetchCompany = async () => {
    try {
      const response = await companyApi.get();
      setCompany(response.data.company);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!company) return;
    setCompany({ ...company, [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    if (!company) return;
    setCompany({ ...company, [field]: e.target.value });
  };

  const handleAddTag = () => {
    if (!company || !newTag.trim() || (company.industry_sector_tags || []).includes(newTag.trim())) return;
    setCompany({
      ...company,
      industry_sector_tags: [...(company.industry_sector_tags || []), newTag.trim()],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!company) return;
    setCompany({
      ...company,
      industry_sector_tags: (company.industry_sector_tags || []).filter((t) => t !== tag),
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const response = await companyApi.uploadLogo(logoFile);
      setCompany(prev => prev ? { ...prev, logo_path: response.data.logo_path } : null);
      setLogoFile(null);
      setLogoPreview(null);
      setSuccess('Logo uploaded successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await companyApi.update(company as unknown as Record<string, unknown>);
      setSuccess('Company profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Company not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
          Company Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={company.name}
                onChange={handleChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={logoPreview || (company.logo_path ? `/storage/${company.logo_path}` : undefined)}
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Button variant="outlined" component="label">
                    Upload Logo
                    <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                  </Button>
                  {logoFile && (
                    <Button
                      variant="contained"
                      onClick={handleLogoUpload}
                      disabled={uploadingLogo}
                      sx={{ ml: 2 }}
                    >
                      {uploadingLogo ? <CircularProgress size={24} color="inherit" /> : 'Save Logo'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select value={company.category} onChange={handleSelectChange('category')} label="Category">
                  {companyCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Website" value={company.website || ''} onChange={handleChange('website')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Postal Address"
                multiline
                rows={2}
                value={company.postal_address || ''}
                onChange={handleChange('postal_address')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Sector" value={company.sector || ''} onChange={handleChange('sector')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nature of Business" value={company.nature_of_business || ''} onChange={handleChange('nature_of_business')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>No. of Employees</InputLabel>
                <Select value={company.no_of_employees || ''} onChange={handleSelectChange('no_of_employees')} label="No. of Employees">
                  {employeeRanges.map((range) => (
                    <MenuItem key={range} value={range}>{range}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Establishment"
                type="date"
                value={company.date_of_establishment || ''}
                onChange={handleChange('date_of_establishment')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Annual Turnover (NIRF)</InputLabel>
                <Select value={company.annual_turnover || ''} onChange={handleSelectChange('annual_turnover')} label="Annual Turnover (NIRF)">
                  {turnoverRanges.map((range) => (
                    <MenuItem key={range} value={range}>{range}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="LinkedIn URL" value={company.linkedin_url || ''} onChange={handleChange('linkedin_url')} />
            </Grid>
            {company.category === 'MNC' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Parent HQ Country" value={company.parent_hq_country || ''} onChange={handleChange('parent_hq_country')} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Parent HQ City" value={company.parent_hq_city || ''} onChange={handleChange('parent_hq_city')} required />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField label="Industry Sector Tags" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                <Button variant="outlined" onClick={handleAddTag}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(company.industry_sector_tags || []).map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Description"
                multiline
                rows={4}
                value={company.description || ''}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" disabled={saving}>
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}