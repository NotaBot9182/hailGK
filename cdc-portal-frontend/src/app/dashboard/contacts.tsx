import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert, Divider, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@/lib/api';

const contactTypes = [
  { id: 'head_hr', title: 'Head HR (Required)', required: true },
  { id: 'poc1', title: 'Primary Point of Contact (Required)', required: true },
  { id: 'poc2', title: 'Secondary Point of Contact (Optional)', required: false },
];

export default function CompanyContacts() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [contacts, setContacts] = useState<any>({
    head_hr: { type: 'head_hr', name: '', designation: '', email: '', mobile: '', landline: '' },
    poc1: { type: 'poc1', name: '', designation: '', email: '', mobile: '', landline: '' },
    poc2: { type: 'poc2', name: '', designation: '', email: '', mobile: '', landline: '' },
  });

  const { data: contactsResponse, isLoading: isFetching } = useQuery({
    queryKey: ['companyContacts'],
    queryFn: companyApi.getContacts,
  });

  useEffect(() => {
    if (contactsResponse?.data?.contacts) {
      const existing = contactsResponse.data.contacts;
      const updated: any = {
        head_hr: { type: 'head_hr', name: '', designation: '', email: '', mobile: '', landline: '' },
        poc1: { type: 'poc1', name: '', designation: '', email: '', mobile: '', landline: '' },
        poc2: { type: 'poc2', name: '', designation: '', email: '', mobile: '', landline: '' },
      };
      
      let hasData = false;
      existing.forEach((c: any) => {
        if (updated[c.type]) {
          updated[c.type] = { ...updated[c.type], ...c };
          if (c.name) hasData = true;
        }
      });
      
      setContacts(updated);
      setIsEditing(!hasData);
    }
  }, [contactsResponse]);

  const handleChange = (type: string, field: string, value: string) => {
    setContacts({
      ...contacts,
      [type]: { ...contacts[type], [field]: value }
    });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: any[]) => companyApi.updateContacts(payload),
    onSuccess: () => {
      setSuccessMsg('Contacts updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['companyContacts'] });
    },
    onError: (error: any) => {
      console.error('Save failed', error);
      alert(error.response?.data?.message || 'Failed to update contacts');
    }
  });

  const handleSave = () => {
    const payload = (Object.values(contacts) as any[]).filter(c => c.name || c.email);
    updateMutation.mutate(payload);
  };

  if (isFetching) return <Box p={4}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, maxWidth: 1000 }}>
      {/* Header element */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#0A1628' }}>
          Contact & HR Details
        </Typography>
      </Box>

      <Typography sx={{ mb: 4, fontSize: '13px', color: '#5A6478' }}>
        Please provide details of the Head HR and Primary Point of Contact.
      </Typography>

      {!isEditing ? (
        <Box sx={{ bgcolor: 'rgba(244,246,249,0.5)', p: 4, borderRadius: 2, border: '1px solid rgba(10,22,40,0.06)' }}>
          <Grid container spacing={4}>
            {contactTypes.map((ct) => {
              const data = contacts[ct.id];
              // Optional contact without data doesn't need to show blank
              if (!ct.required && !data.name && !data.email) return null;
              
              return (
                <Grid item xs={12} key={ct.id}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: 'rgba(10,22,40,0.1)' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1B5E6B', mb: 2 }}>
                      {ct.title}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Full Name</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{data.name || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Designation</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{data.designation || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Email Address</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{data.email || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Mobile No (+91)</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{data.mobile || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', mb: 0.5, fontWeight: 500 }}>Landline</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{data.landline || '—'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(10,22,40,0.08)' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button 
              variant="outlined" 
              onClick={() => setIsEditing(true)}
              sx={{ color: '#0A1628', borderColor: 'rgba(10,22,40,0.2)', px: 4, '&:hover': { borderColor: '#0A1628', bgcolor: 'rgba(10,22,40,0.02)' } }}
            >
              Edit Contacts
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {contactTypes.map((ct) => {
              const data = contacts[ct.id];
              return (
                <Grid item xs={12} key={ct.id}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: 'rgba(10,22,40,0.12)' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1B5E6B', mb: 2 }}>
                      {ct.title}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          size="small"
                          required={ct.required}
                          value={data.name}
                          onChange={(e) => handleChange(ct.id, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Designation"
                          size="small"
                          required={ct.required}
                          value={data.designation}
                          onChange={(e) => handleChange(ct.id, 'designation', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          size="small"
                          required={ct.required}
                          value={data.email}
                          onChange={(e) => handleChange(ct.id, 'email', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Mobile No (+91)"
                          size="small"
                          required={ct.required}
                          value={data.mobile}
                          onChange={(e) => handleChange(ct.id, 'mobile', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Landline (Optional)"
                          size="small"
                          value={data.landline}
                          onChange={(e) => handleChange(ct.id, 'landline', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(10,22,40,0.1)', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              disabled={updateMutation.isPending}
              onClick={handleSave}
              sx={{ bgcolor: '#0A1628', color: '#FEFEFE', px: 4, '&:hover': { bgcolor: '#2C3345' } }}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Contacts'}
            </Button>
            
            {contacts.head_hr?.name && (
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{ color: '#5A6478', borderColor: 'rgba(90,100,120,0.3)', '&:hover': { bgcolor: 'rgba(90,100,120,0.05)', borderColor: '#5A6478' } }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      )}

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')}>
        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
