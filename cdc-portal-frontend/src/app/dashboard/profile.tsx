import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, Autocomplete, Chip, Snackbar, Alert, Divider, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const categories = ['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO'];
const employeeRanges = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
const turnoverRanges = ['Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr'];
const sectors = ['IT/Software', 'Core Engineering', 'Consulting', 'Finance', 'FMCG', 'Analytics', 'Healthcare'];

export default function CompanyProfile() {
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    website: '',
    postal_address: '',
    sector: '',
    industry_sector_tags: [] as string[],
    nature_of_business: '',
    no_of_employees: '',
    date_of_establishment: '',
    annual_turnover: '',
    linkedin_url: '',
    parent_hq_country: '',
    parent_hq_city: '',
    description: '',
    logo_path: '',
  });

  const { data: profileResponse, isLoading: isFetching } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: companyApi.get,
  });

  useEffect(() => {
    if (profileResponse?.data?.company) {
      const freshCompany = profileResponse.data.company;
      if (freshCompany.name) setIsEditing(false);
      else setIsEditing(true);

      setFormData({
        name: freshCompany.name || '',
        category: freshCompany.category || '',
        website: freshCompany.website || '',
        postal_address: freshCompany.postal_address || '',
        sector: freshCompany.sector || '',
        industry_sector_tags: Array.isArray(freshCompany.industry_sector_tags)
          ? freshCompany.industry_sector_tags
          : (freshCompany.industry_sector_tags ? JSON.parse(freshCompany.industry_sector_tags) : []),
        nature_of_business: freshCompany.nature_of_business || '',
        no_of_employees: freshCompany.no_of_employees || '',
        date_of_establishment: freshCompany.date_of_establishment || '',
        annual_turnover: freshCompany.annual_turnover || '',
        linkedin_url: freshCompany.linkedin_url || '',
        parent_hq_country: freshCompany.parent_hq_country || '',
        parent_hq_city: freshCompany.parent_hq_city || '',
        description: freshCompany.description || '',
        logo_path: freshCompany.logo_path || '',
      });
    }
  }, [profileResponse]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: (data: any) => companyApi.update(data),
    onSuccess: () => {
      setSuccessMsg('Profile updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
    },
    onError: (error: any) => {
      console.error('Failed to update profile', error.response?.data);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      ...formData,
      industry_sector_tags: formData.industry_sector_tags,
    });
  };

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(file),
    onSuccess: (res: any) => {
      setFormData((prev) => ({ ...prev, logo_path: res.data.logo_path }));
      setSuccessMsg('Logo uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
    },
    onError: (error: any) => {
      console.error('Failed to upload logo', error.response?.data);
      alert(error.response?.data?.message || 'Failed to upload logo');
    }
  });

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) uploadLogoMutation.mutate(file);
  };

  if (isFetching) return <Box p={4}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, maxWidth: 900 }}>
      {/* Header section with optional top Edit button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#0A1628' }}>
          Company Profile
        </Typography>
      </Box>

      {!isEditing ? (
        <Box sx={{ bgcolor: 'rgba(244,246,249,0.5)', p: 4, borderRadius: 2, border: '1px solid rgba(10,22,40,0.06)' }}>
          {formData.logo_path && (
            <Box sx={{ mb: 4 }}>
              <img
                src={`/storage/${formData.logo_path}`}
                alt="Company Logo"
                style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain' }}
              />
            </Box>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Company Name</Typography>
              <Typography sx={{ fontSize: '15px' }}>{formData.name || '—'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Category</Typography>
              <Typography sx={{ fontSize: '15px' }}>{formData.category || '—'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Website URL</Typography>
              <Typography sx={{ fontSize: '15px', color: formData.website ? '#2A8A9E' : 'inherit' }}>
                {formData.website ? <a href={formData.website} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{formData.website}</a> : '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Primary Sector</Typography>
              <Typography sx={{ fontSize: '15px' }}>{formData.sector || '—'}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Postal Address</Typography>
              <Typography sx={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>{formData.postal_address || '—'}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Industry Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                {formData.industry_sector_tags.length ? formData.industry_sector_tags.map((tag, i) => (
                  <Chip key={i} label={tag} size="small" sx={{ bgcolor: 'white', border: '1px solid #E2E8F0' }} />
                )) : <Typography sx={{ fontSize: '15px' }}>—</Typography>}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>No. of Employees</Typography>
              <Typography sx={{ fontSize: '15px' }}>{formData.no_of_employees || '—'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Annual Turnover</Typography>
              <Typography sx={{ fontSize: '15px' }}>{formData.annual_turnover || '—'}</Typography>
            </Grid>

            {formData.category === 'MNC' && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Parent HQ Country</Typography>
                  <Typography sx={{ fontSize: '15px' }}>{formData.parent_hq_country || '—'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Parent HQ City</Typography>
                  <Typography sx={{ fontSize: '15px' }}>{formData.parent_hq_city || '—'}</Typography>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Company Description</Typography>
              <Typography sx={{ fontSize: '14.5px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{formData.description || '—'}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(10,22,40,0.08)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
              sx={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.2)', px: 4, '&:hover': { borderColor: '#0A1628', bgcolor: 'rgba(10,22,40,0.02)' } }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {formData.logo_path ? (
                <img
                  src={`/storage/${formData.logo_path}`}
                  alt="Company Logo"
                  style={{ maxHeight: '80px', maxWidth: '150px', objectFit: 'contain', border: '1px solid #E2E8F0', padding: '4px', borderRadius: '4px' }}
                />
              ) : (
                <Box sx={{ width: 80, height: 80, bgcolor: '#F4F6F9', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AABF', border: '1px dashed #A0AABF' }}>
                  No Logo
                </Box>
              )}
              <Button variant="outlined" component="label" disabled={uploadLogoMutation.isPending} size="small" sx={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.2)' }}>
                {uploadLogoMutation.isPending ? 'Uploading...' : 'Upload New Logo'}
                <input type="file" hidden accept="image/jpeg, image/png, image/jpg" onChange={handleLogoUpload} />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              size="small"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Category"
              size="small"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website URL"
              size="small"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Postal Address"
              size="small"
              value={formData.postal_address}
              onChange={(e) => handleChange('postal_address', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Primary Sector"
              size="small"
              value={formData.sector}
              onChange={(e) => handleChange('sector', e.target.value)}
            >
              {sectors.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={sectors}
              freeSolo
              size="small"
              value={formData.industry_sector_tags}
              onChange={(_, newValue) => handleChange('industry_sector_tags', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Industry Tags" placeholder="Add tags" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="No. of Employees"
              size="small"
              value={formData.no_of_employees}
              onChange={(e) => handleChange('no_of_employees', e.target.value)}
            >
              {employeeRanges.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Annual Turnover"
              size="small"
              value={formData.annual_turnover}
              onChange={(e) => handleChange('annual_turnover', e.target.value)}
            >
              {turnoverRanges.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {formData.category === 'MNC' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent HQ Country"
                  size="small"
                  value={formData.parent_hq_country}
                  onChange={(e) => handleChange('parent_hq_country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent HQ City"
                  size="small"
                  value={formData.parent_hq_city}
                  onChange={(e) => handleChange('parent_hq_city', e.target.value)}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Company Description"
              size="small"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              disabled={updateMutation.isPending}
              onClick={handleSave}
              sx={{
                bgcolor: '#0A1628',
                color: '#FEFEFE',
                px: 4,
                '&:hover': { bgcolor: '#2C3345' },
              }}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
            {company?.name && (
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{
                  color: '#5A6478',
                  borderColor: 'rgba(90,100,120,0.3)',
                  '&:hover': { bgcolor: 'rgba(90,100,120,0.05)', borderColor: '#5A6478' }
                }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      )}

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')}>
        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
