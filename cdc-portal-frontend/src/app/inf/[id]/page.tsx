'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { notificationsApi } from '@/lib/api';

const INF_TABS = [
  'Intern Profile',
  'Eligibility & Courses',
  'Stipend Details',
  'Selection Process',
  'Declaration'
];

export default function InfFormShell() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (id) fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const res = await notificationsApi.get(id);
      setFormData(res.data.notification);
    } catch (err) {
      console.error('Failed to load INF', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  const simulateAutoSave = () => {
    setSavingStatus('saving');
    setTimeout(() => {
      setSavingStatus('saved');
    }, 800);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F9', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#0A1628', color: '#FEFEFE', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Intern Notification Form (INF)</Typography>
          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Reference: {formData?.reference_number || `INF-${id}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ 
            fontSize: '12px', 
            fontWeight: 500,
            color: savingStatus === 'saving' ? '#E8B64A' : savingStatus === 'error' ? '#EF4444' : '#10B981'
          }}>
            {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'error' ? 'Save Failed' : 'All changes saved'}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/dashboard')}
            sx={{ color: '#FEFEFE', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#FEFEFE' } }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Tabs Layout */}
      <Box sx={{ px: 4, pt: 2, bgcolor: '#FEFEFE', borderBottom: '1px solid rgba(10,22,40,0.1)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, color: '#5A6478', fontSize: '14px' },
            '& .Mui-selected': { color: '#0A1628' },
            '& .MuiTabs-indicator': { bgcolor: '#C8922A' }
          }}
        >
          {INF_TABS.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area (Phase 2 Blank Shell) */}
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900, 
          bgcolor: '#FEFEFE', 
          p: 6, 
          borderRadius: 2, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          textAlign: 'center' 
        }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#0A1628', mb: 2 }}>
            {INF_TABS[activeTab]}
          </Typography>
          <Typography sx={{ color: '#5A6478', mb: 4 }}>
            [Phase 3 implementation required: The fields for {INF_TABS[activeTab]} will be placed here]
          </Typography>
          <Button variant="contained" onClick={simulateAutoSave} sx={{ bgcolor: '#0A1628', '&:hover': { bgcolor: '#2C3345' }}}>
            Simulate Auto-Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
