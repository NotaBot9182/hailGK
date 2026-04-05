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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { companyApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Contact {
  type: 'head_hr' | 'poc1' | 'poc2';
  name: string;
  designation: string;
  email: string;
  mobile: string;
  landline?: string;
}

const contactTypes = [
  { type: 'head_hr', label: 'Head HR' },
  { type: 'poc1', label: 'Primary Point of Contact' },
  { type: 'poc2', label: 'Secondary Point of Contact' },
];

export default function ContactsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchContacts();
  }, [isAuthenticated, router]);

  const fetchContacts = async () => {
    try {
      const response = await companyApi.getContacts();
      const existing = response.data.contacts || [];
      // Ensure we have all three types
      const filled = contactTypes.map(ct => {
        const found = existing.find((c: Contact) => c.type === ct.type);
        return found || { type: ct.type, name: '', designation: '', email: '', mobile: '', landline: '' };
      });
      setContacts(filled);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (index: number, field: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: e.target.value };
    setContacts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await companyApi.updateContacts(contacts);
      setSuccess('Contacts updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update contacts');
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
          Contact & HR Details
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
            {contacts.map((contact, index) => (
              <Grid size={12} key={contact.type}>
                <Card variant="outlined">
                  <CardHeader
                    title={contactTypes.find(ct => ct.type === contact.type)?.label}
                    sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={contact.name}
                          onChange={handleContactChange(index, 'name')}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Designation"
                          value={contact.designation}
                          onChange={handleContactChange(index, 'designation')}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={contact.email}
                          onChange={handleContactChange(index, 'email')}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Mobile (+91)"
                          value={contact.mobile}
                          onChange={handleContactChange(index, 'mobile')}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Landline"
                          value={contact.landline || ''}
                          onChange={handleContactChange(index, 'landline')}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid size={12}>
              <Button type="submit" variant="contained" size="large" disabled={saving}>
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Contacts'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}