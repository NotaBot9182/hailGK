'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, CircularProgress, Grid, TextField, MenuItem, Autocomplete, Chip, Switch, Snackbar, Alert, Checkbox, FormControlLabel, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useParams, useRouter } from 'next/navigation';
import { notificationsApi, adminApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import AiParsePdfDialog from '@/components/AiParsePdfDialog';

const INF_TABS = [
  'Intern Profile',
  'Eligibility & Courses',
  'Stipend Details',
  'Selection Process',
  'Declaration'
];

const ELIGIBLE_PROGRAMS = [
  {
    title: 'B.Tech / B.E (Bachelor of Technology / Engineering)',
    color: '#315482',
    courses: [
      'Applied Geology', 'Applied Geophysics', 'Civil Engineering', 'Computer Science and Engineering', 
      'Electronics and Communication Engineering', 'Electrical Engineering', 'Engineering Geology', 'Environmental Engineering', 
      'Engineering Physics', 'Earthquake Science & Engineering', 'Environmental Science and Engineering', 'Fuel Engineering', 
      'Geomatics', 'Geotechnical Engineering', 'Industrial Engineering and Management', 'Mathematics and Computing', 
      'Mining Engineering', 'Mechanical Engineering', 'Mine Electrical Engineering', 'Mineral Engineering', 
      'Mining Machinery Engineering', 'Opencast Mining', 'Optoelectronics and Optical Communication Engineering', 'Petroleum Engineering', 
      'Power Electronics and Electrical Drives', 'Petroleum Exploration', 'Power System Engineering', 'RF & Microwave Engineering', 
      'Structural Engineering', 'Tunnelling and Underground Space Technology', 'VLSI Design', 'Data Analytics', 
      'Geo-Exploration', 'Chemical Engineering', 'Electronics and Instrumentation Engineering', 'Communication and Signal Processing', 
      'Metallurgical Engineering', 'Fuel & Energy Engineering', 'Optical Communication & Integrated Photonics', 'Artificial Intelligence & Data Science', 
      'Water Resources Engineering', 'Transportation Engineering', 'Fuel, Minerals and Metallurgical Engineering', 'Minerals and Metallurgical Engineering', 
      'Pharmaceutical Science & Engineering', 'Mechanical Engg (Spl: Machine Design)', 'Mechanical Engg. (Spl: Maintenance Engineering and Tribology)'
    ]
  },
  {
    title: 'M.Tech (Master of Technology)',
    color: '#223868',
    courses: [
      'Applied Geology', 'Applied Geophysics', 'Civil Engineering', 'Computer Science and Engineering', 
      'Electronics and Communication Engineering', 'Electrical Engineering', 'Engineering Geology', 'Environmental Engineering', 
      'Engineering Physics', 'Earthquake Science & Engineering', 'Environmental Science and Engineering', 'Fuel Engineering', 
      'Geomatics', 'Geotechnical Engineering', 'Industrial Engineering and Management', 'Mathematics and Computing', 
      'Mining Engineering', 'Mechanical Engineering', 'Mine Electrical Engineering', 'Mineral Engineering', 
      'Mining Machinery Engineering', 'Opencast Mining', 'Optoelectronics and Optical Communication Engineering', 'Petroleum Engineering', 
      'Power Electronics and Electrical Drives', 'Petroleum Exploration', 'Power System Engineering', 'RF & Microwave Engineering', 
      'Structural Engineering', 'Tunnelling and Underground Space Technology', 'VLSI Design', 'Data Analytics', 
      'Geo-Exploration', 'Chemical Engineering', 'Electronics and Instrumentation Engineering', 'Communication and Signal Processing', 
      'Metallurgical Engineering', 'Fuel & Energy Engineering', 'Optical Communication & Integrated Photonics', 'Artificial Intelligence & Data Science', 
      'Water Resources Engineering', 'Transportation Engineering', 'Fuel, Minerals and Metallurgical Engineering', 'Minerals and Metallurgical Engineering', 
      'Pharmaceutical Science & Engineering', 'Mechanical Engg (Spl: Machine Design)', 'Mechanical Engg. (Spl: Maintenance Engineering and Tribology)'
    ]
  },
  {
    title: 'M.Sc (Master of Science)',
    color: '#3A4B5C',
    courses: [
      'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Environmental Science', 
      'Physical Science', 'Chemical Science', 'English', 'Humanities & Social Sciences', 
      'Philosophy', 'Psychology', 'Sociology', 'Social Media and Culture', 'Digital Humanities and Social Sciences'
    ]
  },
  {
    title: 'M.A (Master of Arts)',
    color: '#2E4C63',
    courses: [
      'English', 'Humanities & Social Sciences', 'Philosophy', 'Psychology', 
      'Sociology', 'Social Media and Culture', 'Digital Humanities and Social Sciences'
    ]
  },
  {
    title: 'MBA (Master of Business Administration)',
    color: '#34816C',
    courses: [
      'Master of Business Administration', 'Operation Management', 'Financial Management', 'Management'
    ]
  },
  {
    title: 'Executive MBA',
    color: '#2b6b59',
    courses: [
      'Executive Master of Business Administration', 'Operation Management', 'Financial Management', 'Management'
    ]
  },
  {
    title: 'MBA (Business Analytics)',
    color: '#1a5944',
    courses: ['Business Analytics']
  },
  {
    title: 'Dual Degree',
    color: '#25446e',
    courses: [
      'Computer Science and Engineering+Computer Science and Engineering', 
      'Mining Engineering+Mining Engineering', 'Mineral Engineering+Mineral Engineering', 
      'Mechanical Engg. (Spl: Manufacturing Engineering)', 'Mechanical Engg. (Spl: Thermal Engineering)', 
      'Mining engineering & MBA'
    ]
  },
  {
    title: 'Integrated M.Sc & M.Tech',
    color: '#1d6e5f',
    courses: [
      'Applied Geology', 'Applied Geophysics', 'Civil Engineering', 'Computer Science and Engineering', 
      'Electronics and Communication Engineering', 'Electrical Engineering', 'Engineering Geology', 'Environmental Engineering', 
      'Engineering Physics', 'Earthquake Science & Engineering', 'Environmental Science and Engineering', 'Fuel Engineering', 
      'Geomatics', 'Geotechnical Engineering', 'Industrial Engineering and Management', 'Mathematics and Computing', 
      'Mining Engineering', 'Mechanical Engineering', 'Mine Electrical Engineering', 'Mineral Engineering', 
      'Mining Machinery Engineering', 'Opencast Mining', 'Optoelectronics and Optical Communication Engineering', 'Petroleum Engineering', 
      'Power Electronics and Electrical Drives', 'Petroleum Exploration', 'Power System Engineering', 'RF & Microwave Engineering', 
      'Structural Engineering', 'Tunnelling and Underground Space Technology', 'VLSI Design', 'Data Analytics', 
      'Geo-Exploration', 'Chemical Engineering', 'Electronics and Instrumentation Engineering', 'Communication and Signal Processing', 
      'Metallurgical Engineering', 'Fuel & Energy Engineering', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 
      'Environmental Science', 'Physical Science', 'Chemical Science'
    ]
  }
];

function ProgramBlock({ program, formData, onToggleCourse, onSelectAll }: any) {
  const [expanded, setExpanded] = useState(program.courses.length <= 15);
  const allSelected = program.courses.every((c: string) => (formData?.eligible_courses || []).includes(`${program.title}|${c}`));
  const someSelected = program.courses.some((c: string) => (formData?.eligible_courses || []).includes(`${program.title}|${c}`));
  const count = program.courses.filter((c: string) => (formData?.eligible_courses || []).includes(`${program.title}|${c}`)).length;
  
  return (
    <Box sx={{ mb: 4, border: `1px solid ${program.color}30`, borderRadius: 1, overflow: 'hidden' }}>
      <Box 
        sx={{ bgcolor: program.color, color: '#FEFEFE', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { opacity: 0.95 } }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '14.5px', letterSpacing: '0.02em' }}>
            {program.title}
          </Typography>
          <Chip 
            label={expanded ? "▼ Hide" : `▶ Show (${count}/${program.courses.length} selected)`} 
            size="small" 
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFF', fontSize: '11px', height: 20, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }} 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox 
              size="small" 
              sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#C8922A' }, py: 0 }}
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={(e) => { e.stopPropagation(); onSelectAll(program.title, program.courses, e.target.checked); }}
            />
          }
          label={<Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Select All</Typography>}
          sx={{ mr: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2, bgcolor: `${program.color}06`, maxHeight: 400, overflowY: 'auto' }}>
          <Grid container spacing={1}>
            {program.courses.map((course: string, idx: number) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={(formData?.eligible_courses || []).includes(`${program.title}|${course}`)}
                      onChange={(e) => { e.stopPropagation(); onToggleCourse(`${program.title}|${course}`); }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ color: 'rgba(10,22,40,0.3)', p: 0.5, '&.Mui-checked': { color: '#0A1628' } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '13px', color: '#334155' }}>{course}</Typography>}
                  onClick={(e) => e.stopPropagation()}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}

const STIPEND_GROUPS = [
  { id: 'btech', label: 'B.Tech / Dual / Int. M.Tech', sourcePrograms: ['B.Tech / B.E (Bachelor of Technology / Engineering)', 'Dual Degree', 'Integrated M.Sc & M.Tech'] },
  { id: 'mtech', label: 'M.Tech', sourcePrograms: ['M.Tech (Master of Technology)'] },
  { id: 'mba', label: 'MBA', sourcePrograms: ['MBA (Master of Business Administration)', 'Executive MBA', 'MBA (Business Analytics)'] },
  { id: 'msc', label: 'M.Sc / M.A', sourcePrograms: ['M.Sc (Master of Science)', 'M.A (Master of Arts)'] },
  { id: 'phd', label: 'Ph.D', isPhd: true as const }
];

export default function InfFormShell() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [formData, setFormData] = useState<any>(null);
  const [selectionPdf, setSelectionPdf] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  // Cached stipend data from AI — auto-applied when courses are selected
  const [aiStipendCache, setAiStipendCache] = useState<Record<string, any>>({})

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSubmitted = ['submitted', 'under_review', 'approved', 'rejected'].includes(formData?.status || '');
  const isChangesRequested = formData?.status === 'changes_requested';
  const isReadOnly = isAdmin || isSubmitted; // changes_requested is editable for recruiter

  useEffect(() => {
    if (id) fetchNotification();
  }, [id]);

  // Auto-fill stipend for newly active programme groups whenever courses change
  useEffect(() => {
    if (!formData || Object.keys(aiStipendCache).length === 0) return;
    const activeGroups = getActiveStipendGroups();
    if (activeGroups.length === 0) return;

    setFormData((prev: any) => {
      const stipendDetails = { ...(prev.stipend_details || {}) };
      let changed = false;

      activeGroups.forEach((group: any) => {
        const gid = group.id;
        const stipend = aiStipendCache[`stipend_${gid}`];
        if (stipend != null) {
          if (!stipendDetails[gid]) stipendDetails[gid] = {};
          if (!stipendDetails[gid].stipend) { stipendDetails[gid].stipend = stipend; changed = true; }
        }
      });

      if (!changed) return prev;
      return { ...prev, stipend_details: stipendDetails };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.eligible_courses, formData?.phd_allowed, aiStipendCache]);

  const fetchNotification = async () => {
    try {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) throw new Error('Invalid ID');
      const res = await notificationsApi.get(parsedId);
      const data = res.data.notification;

      // Normalize intern profile fields
      data.intern_title = data.intern_profile?.title || '';
      data.intern_designation = data.intern_profile?.designation || '';
      data.place_of_posting = data.intern_profile?.place_of_posting || [];
      
      if (data.intern_profile?.work_mode === 'on_site') data.work_location_mode = 'On-site';
      else if (data.intern_profile?.work_mode === 'remote') data.work_location_mode = 'Remote';
      else if (data.intern_profile?.work_mode === 'hybrid') data.work_location_mode = 'Hybrid';
      else data.work_location_mode = 'On-site';

      data.expected_hires = data.intern_profile?.expected_hires || '';
      data.minimum_hires = data.intern_profile?.min_hires || '';

      // Eligibility normalization
      data.min_cpi = data.eligibility_criteria?.min_cgpa || '';
      data.high_school_criterion = data.eligibility_criteria?.hs_percentage || '';
      data.backlogs_allowed = data.eligibility_criteria?.backlogs_allowed || false;
      data.gender_filter = data.eligibility_criteria?.gender_filter || 'all';
      data.phd_allowed = !!data.eligibility_criteria?.phd_allowed;
      data.ma_dhss_allowed = !!data.eligibility_criteria?.ma_dhss_allowed;

      data.eligible_courses = (data.eligibility_criteria?.programmes || []).flatMap((p: any) => {
        let coursesArray = p.courses || [];
        if (typeof coursesArray === 'string') {
          try { coursesArray = JSON.parse(coursesArray); } catch (e) { coursesArray = []; }
        }
        return coursesArray.map((c: string) => `${p.programme_name}|${c}`);
      });
      data.expected_duration_months = data.intern_profile?.expected_duration_months || '';
      data.ppo_provision = !!data.intern_profile?.ppo_provision;
      data.required_skills = data.intern_profile?.required_skills || [];
      data.internship_description = data.intern_profile?.internship_description || '';
      data.additional_info = data.intern_profile?.additional_info || '';
      data.registration_link = data.intern_profile?.registration_link || '';
      data.onboarding_procedure = data.intern_profile?.onboarding_procedure || '';

      // Stipend normalization - load per-programme data from salaries
      const mapperReverse: Record<string, string> = {
        'btech_dual': 'btech', 'mtech': 'mtech', 'mba': 'mba', 'msc_msctech': 'msc', 'phd': 'phd'
      };
      data.stipend_details = {};
      data.stipend_currency = 'INR';
      if (data.salaries && Array.isArray(data.salaries)) {
        data.salaries.forEach((s: any) => {
          const frontKey = mapperReverse[s.programme];
          if (frontKey) {
            data.stipend_details[frontKey] = { stipend: s.ctc_annual };
            if (!data.stipend_currency || data.stipend_currency === 'INR') data.stipend_currency = s.currency || 'INR';
          }
        });
      }
      data.ctc_breakup = data.intern_profile?.ctc_breakup || '';
      if (data.salary_same_for_all === undefined) data.salary_same_for_all = false;

      // Initialize selection fields
      if (!data.selection_stages) data.selection_stages = [];
      if (!data.selection_infra) data.selection_infra = {
        team_members_required: 0, rooms_required: 0,
        psychometric_test: false, medical_test: false,
        other_screening: '', selection_process_pdf_path: null
      };

      // Initialize declaration fields
      if (!data.declaration) data.declaration = {
        aipc_guidelines: false, shortlisting_commitment: false,
        accuracy_profile: false, consent_ranking_agencies: false,
        adherence_toc: false, rti_nirf_consent: false,
        signatory_name: '', signatory_designation: '', typed_signature: ''
      };

      setFormData(data);
    } catch (err) {
      console.error('Failed to load INF', err);
      router.push('/dashboard');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...(prev || {}), [field]: value }));
  };

  const handleCourseToggle = (courseId: string) => {
    const current = formData?.eligible_courses || [];
    if (current.includes(courseId)) {
      handleChange('eligible_courses', current.filter((c: string) => c !== courseId));
    } else {
      handleChange('eligible_courses', [...current, courseId]);
    }
  };

  const handleSelectAll = (programTitle: string, courses: string[], select: boolean) => {
    const current = formData?.eligible_courses || [];
    const programCourseIds = courses.map(c => `${programTitle}|${c}`);
    if (select) {
      const otherCourses = current.filter((c: string) => !programCourseIds.includes(c));
      handleChange('eligible_courses', [...otherCourses, ...programCourseIds]);
    } else {
      handleChange('eligible_courses', current.filter((c: string) => !programCourseIds.includes(c)));
    }
  };

  const handleEligibilitySave = async () => {
    try {
      setSavingStatus('saving');
      const safeFloat = (v: any) => (v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v))) ? parseFloat(v) : null;
      
      const programmes = ELIGIBLE_PROGRAMS.map(prog => {
        const selectedCourses = (formData.eligible_courses || []).filter((c: string) => c.startsWith(`${prog.title}|`)).map((c: string) => c.split('|')[1]);
        if (selectedCourses.length === 0) return null;
        return {
          code: prog.title.split('(')[0].trim(),
          name: prog.title,
          is_selected: true,
          min_cpi: safeFloat(formData.min_cpi),
          courses: selectedCourses
        };
      }).filter(Boolean);

      const payload = {
        min_cgpa: safeFloat(formData.min_cpi),
        backlogs_allowed: !!formData.backlogs_allowed,
        hs_percentage: safeFloat(formData.high_school_criterion),
        gender_filter: (formData.gender_filter || 'all').toLowerCase(),
        phd_allowed: !!formData.phd_allowed,
        phd_departments: formData.phd_departments || '',
        ma_dhss_allowed: !!formData.ma_dhss_allowed,
        programmes: programmes
      };

      await notificationsApi.updateEligibility(parseInt(id), payload);
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Eligibility settings saved!', severity: 'success' });
    } catch (error: any) {
      console.error('Eligibility Save Error:', error.response?.data || error);
      setSavingStatus('error');
      const msg = error.response?.data?.message || 'Failed to save eligibility settings';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const getActiveStipendGroups = () => {
    const selectedCourses = formData?.eligible_courses || [];
    return STIPEND_GROUPS.filter(group => {
      if ('isPhd' in group && group.isPhd) return !!formData?.phd_allowed;
      return group.sourcePrograms?.some(progTitle =>
        selectedCourses.some((cId: string) => cId.startsWith(`${progTitle}|`))
      );
    });
  };

  const handleStipendChange = (groupId: string, value: any) => {
    const current = { ...(formData?.stipend_details || {}) };
    if (formData?.salary_same_for_all) {
      getActiveStipendGroups().forEach(g => {
        if (!current[g.id]) current[g.id] = {};
        current[g.id].stipend = value;
      });
    } else {
      if (!current[groupId]) current[groupId] = {};
      current[groupId].stipend = value;
    }
    handleChange('stipend_details', current);
  };

  const handleSameForAllToggle = (checked: boolean) => {
    handleChange('salary_same_for_all', checked);
    if (checked) {
      const activeGroups = getActiveStipendGroups();
      if (activeGroups.length > 0) {
        const firstVal = formData?.stipend_details?.[activeGroups[0].id]?.stipend || '';
        const updated = { ...(formData?.stipend_details || {}) };
        activeGroups.forEach(g => { updated[g.id] = { stipend: firstVal }; });
        handleChange('stipend_details', updated);
      }
    }
  };

  const handleStipendSave = async () => {
    try {
      setSavingStatus('saving');
      const safeFloat = (v: any) => (v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v))) ? parseFloat(v) : null;
      const mapper: Record<string, string> = {
        'btech': 'btech_dual', 'mtech': 'mtech', 'mba': 'mba', 'msc': 'msc_msctech', 'phd': 'phd'
      };

      const salaries = Object.entries(formData.stipend_details || {}).map(([key, details]: [string, any]) => {
        const backendKey = mapper[key];
        if (!backendKey) return null;
        return {
          programme: backendKey,
          ctc_annual: safeFloat(details.stipend),
          base_fixed: null, monthly_takehome: null,
          joining_bonus: null, retention_bonus: null, variable_bonus: null,
          esop_value: null, stocks_options: null, relocation_allowance: null,
          medical_allowance: null, deductions: '', bond_amount: null,
          ctc_breakup: formData.ctc_breakup || '',
          gross_salary: null,
          currency: formData.stipend_currency || 'INR'
        };
      }).filter(Boolean);

      await notificationsApi.updateSalary(parseInt(id), { salaries });
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Stipend details saved!', severity: 'success' });
    } catch (error: any) {
      console.error('Stipend Save Error:', error.response?.data || error);
      setSavingStatus('error');
      const msg = error.response?.data?.message || 'Failed to save stipend details.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleSelectionStageToggle = (type: string, enabled: boolean) => {
    let current = [...(formData?.selection_stages || [])];
    if (enabled) {
      if (!current.some(s => s.stage_type === type)) {
        current.push({ stage_type: type, stage_mode: 'offline', is_enabled: true, sort_order: current.length });
      }
    } else {
      current = current.filter(s => s.stage_type !== type);
    }
    handleChange('selection_stages', current);
  };

  const handleAddRound = (type: string) => {
    const current = [...(formData?.selection_stages || [])];
    if (current.filter(s => s.stage_type === type).length < 10) {
      current.push({
        stage_type: type, stage_mode: 'offline',
        test_type: type === 'test' ? 'Aptitude' : null,
        interview_mode: type === 'interview' ? 'video_conferencing' : null,
        duration_minutes: 60, is_enabled: true, sort_order: current.length
      });
      handleChange('selection_stages', current);
    }
  };

  const handleRemoveRound = (type: string, index: number) => {
    const current = [...(formData?.selection_stages || [])];
    const stageIndices = current.map((s, i) => s.stage_type === type ? i : -1).filter(i => i !== -1);
    if (stageIndices.length > 0) {
      current.splice(stageIndices[index], 1);
      handleChange('selection_stages', current);
    }
  };

  const handleSelectionSave = async () => {
    try {
      setSavingStatus('saving');
      const normalizedStages = (formData.selection_stages || []).map((stage: any) => ({
        ...stage, stage_mode: (stage.stage_mode || 'online').toLowerCase(),
        stage_type: (stage.stage_type || 'Test').replace(' ', '_'),
      }));
      const payload = { stages: normalizedStages, infra: formData.selection_infra || {} };
      await notificationsApi.updateSelection(parseInt(id), payload);
      if (selectionPdf) await notificationsApi.uploadSelectionPdf(parseInt(id), selectionPdf);
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Selection process saved!', severity: 'success' });
    } catch (err: any) {
      setSavingStatus('error');
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save selection process', severity: 'error' });
    }
  };

  const handleDeclarationSave = async () => {
    try {
      setSavingStatus('saving');
      await notificationsApi.updateDeclaration(parseInt(id), formData?.declaration || {});
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Declaration saved!', severity: 'success' });
    } catch (err: any) {
      setSavingStatus('error');
      setSnackbar({ open: true, message: 'Failed to save declaration', severity: 'error' });
    }
  };

  const handleInfSubmit = async () => {
    try {
      setSavingStatus('saving');
      await notificationsApi.updateDeclaration(parseInt(id), formData?.declaration || {});
      await notificationsApi.submit(parseInt(id));
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'INF submitted successfully!', severity: 'success' });
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setSavingStatus('error');
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit INF.', severity: 'error' });
    }
  };

  const handleInternProfileSave = async () => {
    try {
      setSavingStatus('saving');
      const safeInt = (v: any) => (v !== null && v !== undefined && v !== '' && !isNaN(parseInt(v))) ? parseInt(v) : null;
      
      const payload = {
        title: formData.intern_title || '',
        designation: formData.intern_designation || '',
        place_of_posting: (Array.isArray(formData.place_of_posting) && formData.place_of_posting.length > 0)
          ? formData.place_of_posting
          : [formData.place_of_posting || 'TBD'].filter(Boolean),
        work_mode: (formData.work_location_mode || 'on_site').toLowerCase().replace('-', '_').replace(' ', '_'),
        expected_hires: safeInt(formData.expected_hires),
        min_hires: safeInt(formData.minimum_hires),
        expected_duration_months: safeInt(formData.expected_duration_months) || 2,
        ppo_provision: !!formData.ppo_provision,
        required_skills: formData.required_skills || [],
        internship_description: formData.internship_description || '',
        additional_info: formData.additional_info || '',
        registration_link: formData.registration_link || '',
        onboarding_procedure: formData.onboarding_procedure || '',
      };

      console.log('Intern Profile Payload:', payload);
      await notificationsApi.updateInternProfile(parseInt(id), payload);
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Intern Profile saved successfully!', severity: 'success' });
    } catch (error: any) {
      console.error('Intern Profile Save Error:', error.response?.data || error);
      setSavingStatus('error');
      const errorMsg = error.response?.data?.message || 'Failed to save Intern Profile. Please check required fields.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleAiApply = (aiData: Record<string, any>) => {
    // Cache stipend data so it can be applied when courses are selected later
    const stipendCache: Record<string, any> = {};
    ['btech','mtech','mba','msc','phd'].forEach(g => {
      if (aiData[`stipend_${g}`] != null) stipendCache[`stipend_${g}`] = aiData[`stipend_${g}`];
    });
    setAiStipendCache(stipendCache);

    setFormData((prev: any) => {
      const next = { ...prev };
      if (aiData.intern_title)          next.intern_title = aiData.intern_title;
      // Always fill designation: use extracted designation, or fall back to title if AI returned null
      const des = aiData.intern_designation || aiData.intern_title;
      if (des) next.intern_designation = des;
      if (aiData.place_of_posting?.length) next.place_of_posting = aiData.place_of_posting;
      if (aiData.work_location_mode)    next.work_location_mode = aiData.work_location_mode;
      if (aiData.expected_hires)        next.expected_hires = aiData.expected_hires;
      if (aiData.expected_duration_months) next.expected_duration_months = aiData.expected_duration_months;
      if (aiData.ppo_provision != null) next.ppo_provision = aiData.ppo_provision;
      if (aiData.internship_description) next.internship_description = aiData.internship_description;
      if (aiData.required_skills?.length) next.required_skills = aiData.required_skills;
      if (aiData.min_cpi != null)       next.min_cpi = aiData.min_cpi;
      if (aiData.backlogs_allowed != null) next.backlogs_allowed = aiData.backlogs_allowed;
      if (aiData.gender_filter)         next.gender_filter = aiData.gender_filter;

      // Auto-select courses based on target_programmes
      if (aiData.target_programmes && Array.isArray(aiData.target_programmes)) {
        const newCourses = new Set(prev.eligible_courses || []);
        const mappedTitles: string[] = [];
        const targets = aiData.target_programmes.map((p: string) => p.toLowerCase());
        
        if (targets.some(t => t.includes('b.tech') || t.includes('btech') || t.includes('b.e'))) {
          mappedTitles.push('B.Tech / B.E (Bachelor of Technology / Engineering)', 'Dual Degree', 'Integrated M.Sc & M.Tech');
        }
        if (targets.some(t => t.includes('m.tech') || t.includes('mtech'))) {
          mappedTitles.push('M.Tech (Master of Technology)');
        }
        if (targets.some(t => t.includes('mba'))) {
          mappedTitles.push('MBA (Master of Business Administration)', 'Executive MBA', 'MBA (Business Analytics)');
        }
        if (targets.some(t => t.includes('m.sc') || t.includes('msc') || t.includes('m.a') || t.includes('ma'))) {
          mappedTitles.push('M.Sc (Master of Science)', 'M.A (Master of Arts)');
        }
        if (targets.some(t => t.includes('ph.d') || t.includes('phd'))) {
          next.phd_allowed = true;
        }

        ELIGIBLE_PROGRAMS.forEach(prog => {
          if (mappedTitles.includes(prog.title)) {
            prog.courses.forEach(c => newCourses.add(`${prog.title}|${c}`));
          }
        });
        next.eligible_courses = Array.from(newCourses);
      }

      // Apply stipend immediately for already-active groups
      const stipendDetails = { ...(prev.stipend_details || {}) };
      ['btech','mtech','mba','msc','phd'].forEach(g => {
        const val = aiData[`stipend_${g}`];
        if (val != null) {
          if (!stipendDetails[g]) stipendDetails[g] = {};
          stipendDetails[g].stipend = val;
        }
      });
      next.stipend_details = stipendDetails;
      return next;
    });
    setSnackbar({ open: true, message: '✨ AI data applied! Courses and stipend details have been auto-populated based on the document.', severity: 'success' });
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
          {!isAdmin && (
            <Typography sx={{ 
              fontSize: '12px', 
              fontWeight: 500,
              color: savingStatus === 'saving' ? '#E8B64A' : savingStatus === 'error' ? '#EF4444' : '#10B981'
            }}>
              {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'error' ? 'Save Failed' : 'All changes saved'}
            </Typography>
          )}
          {isAdmin && formData?.status && (
            <Chip label={formData.status.replace('_', ' ').toUpperCase()} size="small" sx={{ bgcolor: 'rgba(200,146,42,0.2)', color: '#FFF', fontWeight: 600, fontSize: '11px' }} />
          )}
          {!isAdmin && !isSubmitted && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AutoAwesomeIcon sx={{ fontSize: '15px !important' }} />}
              onClick={() => setShowAiDialog(true)}
              sx={{
                bgcolor: 'rgba(200,146,42,0.15)',
                color: '#C8922A',
                border: '1px solid rgba(200,146,42,0.4)',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(200,146,42,0.25)', boxShadow: 'none' },
              }}
            >
              AI Auto-Fill
            </Button>
          )}
          <Button 
            variant="outlined" 
            onClick={() => router.push(isAdmin ? '/admin' : '/dashboard')}
            sx={{ color: '#FEFEFE', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#FEFEFE' } }}
          >
            {isAdmin ? 'Back to Admin Panel' : 'Back to Dashboard'}
          </Button>
        </Box>
      </Box>

      {/* Admin View-Only Banner */}
      {isAdmin && (
        <Box sx={{ bgcolor: '#FEF3C7', borderBottom: '1px solid #F59E0B', px: 4, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
              🔒 Admin View Only
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#A16207' }}>
              You are viewing this {formData?.type?.toUpperCase() || 'INF'} as an admin. Fields are read-only.
            </Typography>
          </Box>
          {['submitted', 'under_review'].includes(formData?.status || '') && (
            <Button size="small" variant="contained"
              disabled={(formData?.revision_count ?? 0) >= 2}
              onClick={() => setShowChangeDialog(true)}
              sx={{ bgcolor: '#92400E', fontSize: '12px', fontWeight: 600, '&:hover': { bgcolor: '#78350F' }, '&:disabled': { bgcolor: 'rgba(146,64,14,0.3)', color: '#fff' } }}>
              {(formData?.revision_count ?? 0) >= 2
                ? 'Revision Limit Reached (2/2)'
                : `Request Changes (${formData?.revision_count ?? 0}/2 used)`}
            </Button>
          )}
        </Box>
      )}

      {/* Changes Requested Banner – shown to the recruiter */}
      {!isAdmin && isChangesRequested && (
        <Box sx={{ bgcolor: '#FEF3C7', borderBottom: '2px solid #F59E0B', px: 4, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ fontSize: '20px', lineHeight: 1 }}>✏️</Typography>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#92400E' }}>
                  Changes Requested by Admin
                </Typography>
                <Chip
                  label={`Revision ${formData?.revision_count ?? 1} of 2`}
                  size="small"
                  sx={{ bgcolor: '#F59E0B', color: '#fff', fontWeight: 700, fontSize: '11px' }}
                />
              </Box>
              <Typography sx={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5 }}>
                Please read the admin&apos;s notes below, update the form, and re-submit when ready.
              </Typography>
              {formData?.review_notes && (
                <Box sx={{ mt: 1.5, p: 2, bgcolor: 'rgba(245,158,11,0.1)', borderRadius: 1, border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400E', mb: 0.5 }}>Admin Notes:</Typography>
                  <Typography sx={{ fontSize: '13px', color: '#78350F', whiteSpace: 'pre-line' }}>{formData.review_notes}</Typography>
                </Box>
              )}
              {(formData?.revision_count ?? 0) >= 2 && (
                <Typography sx={{ fontSize: '12px', color: '#DC2626', fontWeight: 600, mt: 1 }}>
                  ⚠️ This is your final revision — no further changes can be requested after re-submission.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Tabs Layout - Premium Process Stepper (Compact) */}
      <Box sx={{ py: 3.5, bgcolor: '#FEFEFE', background: 'radial-gradient(circle at 50% 0%, rgba(200,146,42,0.04) 0%, transparent 60%), linear-gradient(180deg, #FEFEFE 0%, #F8F9FA 100%)', borderBottom: '1px solid rgba(10,22,40,0.08)' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: '2rem' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${INF_TABS.length}, 1fr)` }, gap: 0, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, left: `calc(${100 / (INF_TABS.length * 2)}% + 20px)`, right: `calc(${100 / (INF_TABS.length * 2)}% + 20px)`, height: '2px', bgcolor: 'rgba(10,22,40,0.06)', display: { xs: 'none', md: 'block' }, zIndex: 0 }} />
            
            {INF_TABS.map((label, i) => {
              const isActive = activeTab === i;
              
              let isSaved = false;
              if (formData) {
                if (i === 0) isSaved = !!formData.intern_title;
                else if (i === 1) isSaved = (formData.eligible_courses?.length > 0) || (formData.min_cpi !== null && formData.min_cpi !== undefined);
                else if (i === 2) isSaved = Object.keys(formData.stipend_details || {}).length > 0;
                else if (i === 3) isSaved = (formData.selection_stages || []).length > 0;
                else if (i === 4) isSaved = !!formData.declaration?.signatory_name || Object.keys(formData.declaration || {}).length > 0;
              }

              const isPast = isSaved && !isActive;

              return (
                <Box 
                  key={i} 
                  onClick={() => handleTabChange(null as any, i)}
                  sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25, px: 1, textAlign: 'center', 
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', 
                    opacity: isActive ? 1 : isPast ? 0.9 : 0.6, 
                    '&:hover': { opacity: 1, transform: isActive ? 'none' : 'translateY(-2px)' },
                    position: 'relative', zIndex: 2
                  }}
                >
                  <Box sx={{ 
                    width: 34, height: 34, 
                    bgcolor: isActive ? '#0A1628' : isPast ? '#FEFEFE' : '#FEFEFE', 
                    border: `1.5px solid ${isActive ? '#0A1628' : isPast ? '#107B4F' : '#E2E8F0'}`, 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontWeight: isActive ? 700 : 600, 
                    color: isActive ? '#FEFEFE' : isPast ? '#107B4F' : '#94A3B8', 
                    boxShadow: isActive ? '0 8px 16px rgba(10,22,40,0.15), 0 0 0 4px rgba(10,22,40,0.03)' : isPast ? '0 2px 8px rgba(16,123,79,0.08)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    '&:hover': {
                      boxShadow: isActive ? '0 8px 16px rgba(10,22,40,0.15), 0 0 0 4px rgba(10,22,40,0.03)' : '0 4px 8px rgba(10,22,40,0.05)'
                    }
                  }}>
                    {isPast ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : `0${i + 1}`}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, transform: isActive ? 'translateY(2px)' : 'none', transition: 'transform 0.3s' }}>
                    <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: isActive ? '15.5px' : '14px', fontWeight: isActive ? 600 : 500, color: isActive ? '#0A1628' : '#334155', lineHeight: 1.1, transition: 'all 0.3s' }}>{label}</Typography>
                    <Typography sx={{ fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: isActive ? 700 : 600, color: isPast ? '#107B4F' : isActive ? '#C8922A' : '#94A3B8', transition: 'all 0.3s' }}>
                      {isPast ? 'Saved' : isActive ? 'Active' : 'Pending'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <fieldset disabled={isReadOnly} style={{ border: 'none', padding: 0, margin: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isReadOnly ? 0.85 : 1 }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900, 
          bgcolor: '#FEFEFE', 
          p: 6, 
          borderRadius: 2, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          textAlign: activeTab === 0 ? 'left' : 'center' 
        }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#0A1628', mb: 2, textAlign: 'center' }}>
            {INF_TABS[activeTab]}
          </Typography>

          {/* ─── Tab 0: Intern Profile ─── */}
          {activeTab === 0 && (
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Internship Title *" size="small" value={formData?.intern_title || ''} onChange={(e) => handleChange('intern_title', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Designation (formal)" size="small" value={formData?.intern_designation || ''} onChange={(e) => handleChange('intern_designation', e.target.value)} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    size="small"
                    value={formData?.place_of_posting || []}
                    onChange={(_, newValue) => handleChange('place_of_posting', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Place of Posting *" placeholder="Add locations" />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth select label="Work Location Mode" size="small" value={formData?.work_location_mode || ''} onChange={(e) => handleChange('work_location_mode', e.target.value)}>
                    <MenuItem value="On-site">On-site</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Expected Interns *" type="number" size="small" value={formData?.expected_hires || ''} onChange={(e) => handleChange('expected_hires', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Minimum Interns" type="number" size="small" value={formData?.minimum_hires || ''} onChange={(e) => handleChange('minimum_hires', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Duration (months) *" type="number" size="small" inputProps={{ min: 1, max: 12 }} value={formData?.expected_duration_months || ''} onChange={(e) => handleChange('expected_duration_months', e.target.value)} />
                </Grid>

                {/* PPO Provision */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: formData?.ppo_provision ? 'rgba(200, 146, 42, 0.06)' : 'rgba(244,246,249,0.5)', border: '1px solid', borderColor: formData?.ppo_provision ? '#C8922A' : 'rgba(10,22,40,0.1)', borderRadius: 2, transition: 'all 0.3s' }}>
                    <Switch 
                      checked={!!formData?.ppo_provision} 
                      onChange={(e) => handleChange('ppo_provision', e.target.checked)} 
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#C8922A' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#C8922A' } }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#0A1628', fontSize: '14px' }}>Pre-Placement Offer (PPO) Provision</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#5A6478' }}>Does this internship offer the possibility of a full-time offer (PPO)?</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    size="small"
                    value={formData?.required_skills || []}
                    onChange={(_, newValue) => handleChange('required_skills', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Required Skills" placeholder="Add skills" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    fullWidth multiline rows={4} label="Internship Description" size="small" 
                    helperText="Provide full description. Alternatively, you can upload a PDF below." 
                    value={formData?.internship_description || ''} 
                    onChange={(e) => handleChange('internship_description', e.target.value)} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    fullWidth multiline rows={3} label="Additional Info" size="small" 
                    inputProps={{ maxLength: 1000 }} helperText="Maximum 1000 characters" 
                    value={formData?.additional_info || ''} 
                    onChange={(e) => handleChange('additional_info', e.target.value)} 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Registration Link" size="small" helperText="Company's own link (if any)" value={formData?.registration_link || ''} onChange={(e) => handleChange('registration_link', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth multiline rows={2} label="Onboarding Procedure" size="small" value={formData?.onboarding_procedure || ''} onChange={(e) => handleChange('onboarding_procedure', e.target.value)} />
                </Grid>
              </Grid>

              {/* PDF Upload */}
              <Box sx={{ mt: 4, p: 3, border: '2px dashed #C8922A', borderRadius: 2, bgcolor: 'rgba(200, 146, 42, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, color: '#0A1628' }}>Alternative: Upload Internship Description (PDF)</Typography>
                <Typography sx={{ fontSize: '13px', color: '#5A6478', mt: -1, textAlign: 'center' }}>
                  If you have a pre-formatted description document, you can upload it here directly.
                </Typography>
                <Button variant="contained" component="label" sx={{ bgcolor: '#C8922A', color: '#1B2430', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#E8B64A' } }}>
                  Browse PDF File
                  <input type="file" hidden accept="application/pdf" />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleInternProfileSave} sx={{ bgcolor: '#0A1628', px: 4, py: 1, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Intern Profile
                </Button>
              </Box>
            </Box>
          )}

          {/* ─── Tab 1: Eligibility & Courses ─── */}
          {activeTab === 1 && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              {ELIGIBLE_PROGRAMS.map((program, index) => (
                <ProgramBlock 
                  key={index} 
                  program={program} 
                  formData={formData} 
                  onToggleCourse={handleCourseToggle} 
                  onSelectAll={handleSelectAll} 
                />
              ))}

              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ p: 3, bgcolor: 'rgba(244,246,249,0.5)', borderRadius: 2, border: '1px solid rgba(10,22,40,0.1)' }}>
                  <Typography sx={{ fontWeight: 600, color: '#0A1628', mb: 3 }}>Special Degree Programs</Typography>
                  <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '14px', color: '#334155' }}>Ph.D (GATE/NET) Applicable?</Typography>
                        <Switch 
                          checked={!!formData?.phd_allowed} 
                          onChange={(e) => handleChange('phd_allowed', e.target.checked)} 
                          color="primary"
                        />
                      </Box>
                      {formData?.phd_allowed && (
                        <TextField 
                          fullWidth size="small" label="Specify required departments" sx={{ mt: 2 }}
                          value={formData?.phd_departments || ''}
                          onChange={(e) => handleChange('phd_departments', e.target.value)}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <Typography sx={{ fontSize: '14px', color: '#334155' }}>M.A. Digital Humanities & Social Sciences</Typography>
                        <Switch 
                          checked={!!formData?.ma_dhss_allowed} 
                          onChange={(e) => handleChange('ma_dhss_allowed', e.target.checked)} 
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 3, bgcolor: 'rgba(244,246,249,0.5)', borderRadius: 2, border: '1px solid rgba(10,22,40,0.1)' }}>
                  <Typography sx={{ fontWeight: 600, color: '#0A1628', mb: 3 }}>General Eligibility Criteria</Typography>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth label="Per-discipline Min. CPI" size="small" type="number"
                        inputProps={{ step: "0.1", max: "10", min: "0" }}
                        value={formData?.min_cpi || ''}
                        onChange={(e) => handleChange('min_cpi', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth label="High School % Criterion" size="small" type="number"
                        value={formData?.high_school_criterion || ''}
                        onChange={(e) => handleChange('high_school_criterion', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth select label="Gender Filter" size="small"
                        value={formData?.gender_filter || 'All'}
                        onChange={(e) => handleChange('gender_filter', e.target.value)}
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', px: 1 }}>
                        <Typography sx={{ fontSize: '14px', color: '#334155' }}>Backlogs allowed?</Typography>
                        <Switch 
                          checked={!!formData?.backlogs_allowed} 
                          onChange={(e) => handleChange('backlogs_allowed', e.target.checked)} 
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleEligibilitySave} sx={{ bgcolor: '#0A1628', px: 4, py: 1, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Eligibility Settings
                </Button>
              </Box>
            </Box>
          )}

          {/* ─── Tab 2: Stipend Details ─── */}
          {activeTab === 2 && (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              {/* Header with Currency and Same Structure Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#C8922A', px: 2, py: 0.8, borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Typography sx={{ color: '#FEFEFE', fontWeight: 600, fontSize: '13px' }}>★ Currency:</Typography>
                  <Typography sx={{ color: '#FEFEFE', fontWeight: 500, fontSize: '13px' }}>
                    {['INR', 'USD', 'EUR'].map((curr, idx) => (
                      <span key={curr}
                        style={{ cursor: 'pointer', textDecoration: (formData?.stipend_currency || 'INR') === curr ? 'underline' : 'none', fontWeight: (formData?.stipend_currency || 'INR') === curr ? 700 : 500 }}
                        onClick={() => handleChange('stipend_currency', curr)}
                      >
                        {curr}{idx < 2 ? ' / ' : ''}
                      </span>
                    ))}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#107B4F', color: '#FFF', px: 2, py: 0.8, borderRadius: 1, gap: 1 }}>
                  <Checkbox size="small" checked={!!formData?.salary_same_for_all}
                    onChange={(e) => handleSameForAllToggle(e.target.checked)}
                    sx={{ color: '#FFF', '&.Mui-checked': { color: '#FFF' }, p: 0 }} />
                  <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Same for all programmes</Typography>
                </Box>
              </Box>

              {/* Stipend Table */}
              <Box sx={{ border: '1px solid rgba(10,22,40,0.15)', borderRadius: 1.5, overflow: 'hidden', mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', bgcolor: '#0A1628', color: '#FFF', py: 1.8, px: 2 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#C8922A' }}>PROGRAMME</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Stipend (per month)</Typography>
                </Box>

                {getActiveStipendGroups().length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Typography sx={{ color: '#5A6478', fontSize: '14px' }}>
                      No programs selected in "Eligibility & Courses". Please select programs first.
                    </Typography>
                  </Box>
                ) : (
                  getActiveStipendGroups().map((group, idx) => (
                    <Box key={group.id} sx={{
                      display: 'grid', gridTemplateColumns: '2fr 1.5fr', px: 2, py: 2, alignItems: 'center',
                      borderTop: idx > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none',
                      bgcolor: idx % 2 === 1 ? 'rgba(244,246,249,0.3)' : 'transparent'
                    }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0A1628' }}>{group.label}</Typography>
                      <Box sx={{ px: 0.5 }}>
                        <TextField
                          fullWidth size="small" type="number" placeholder="e.g. 50000"
                          value={formData?.stipend_details?.[group.id]?.stipend || ''}
                          onChange={(e) => handleStipendChange(group.id, e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1, color: '#C8922A', fontWeight: 700, fontSize: '13px' }}>
                                {formData?.stipend_currency === 'USD' ? '$' : formData?.stipend_currency === 'EUR' ? '€' : '₹'}
                              </Typography>
                            ),
                            endAdornment: <Typography sx={{ ml: 1, color: '#5A6478', fontSize: '11px' }}>/mo</Typography>,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: '#FFF', fontSize: '13px',
                              borderLeft: '3px solid #C8922A',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                              '& fieldset': { borderColor: 'rgba(200, 146, 42, 0.2)' },
                              '&:hover fieldset': { borderColor: '#C8922A' },
                              '&.Mui-focused fieldset': { borderColor: '#0A1628', borderWidth: '1px' },
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              {/* CTC Breakup Notes */}
              <Box sx={{ border: '1px solid rgba(10,22,40,0.15)', borderRadius: 2, overflow: 'hidden', mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Box sx={{ bgcolor: '#0A1628', color: '#FFF', py: 1.5, px: 3 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>CTC BREAKUP NOTES (Optional)</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <TextField fullWidth multiline rows={4} size="small"
                    placeholder="e.g. Stipend + Travel allowance ₹5,000/month + Accommodation provided"
                    value={formData?.ctc_breakup || ''}
                    onChange={(e) => handleChange('ctc_breakup', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FFF', fontSize: '13px', borderLeft: '3px solid #0A1628', '& fieldset': { borderColor: 'rgba(10,22,40,0.1)' }, '&:hover fieldset': { borderColor: '#C8922A' }, '&.Mui-focused fieldset': { borderColor: '#0A1628', borderWidth: '1px' } } }}
                  />
                  <Typography sx={{ fontSize: '11px', color: '#94a3b8', mt: 1 }}>
                    Include details like travel allowance, accommodation, meal coupons, performance bonus, or any other perks.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleStipendSave} sx={{ bgcolor: '#0A1628', px: 4, py: 1, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Stipend Details
                </Button>
              </Box>
            </Box>
          )}

          {/* ─── Tab 3: Selection Process ─── */}
          {activeTab === 3 && (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 3 }}>Selection Stages & Rounds</Typography>
                <Grid container spacing={4}>
                  {[
                    { id: 'ppt', label: 'Pre-Placement Talk' },
                    { id: 'resume', label: 'Resume Shortlisting' },
                    { id: 'gd', label: 'Group Discussion' },
                  ].map((stage) => {
                    const activeStage = (formData?.selection_stages || []).find((s: any) => s.stage_type === stage.id);
                    return (
                      <Grid item xs={12} md={4} key={stage.id}>
                        <Box sx={{ p: 3, border: '1px solid rgba(10,22,40,0.1)', borderRadius: 2, bgcolor: activeStage ? 'rgba(200, 146, 42, 0.03)' : 'rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 600, color: '#0A1628' }}>{stage.label}</Typography>
                            <Switch checked={!!activeStage} onChange={(e) => handleSelectionStageToggle(stage.id, e.target.checked)} />
                          </Box>
                          {activeStage && (
                            <TextField select fullWidth size="small" label="Selection Mode" value={activeStage.stage_mode || 'offline'}
                              onChange={(e) => {
                                const stages = [...formData.selection_stages];
                                const idx = stages.findIndex(s => s.stage_type === stage.id);
                                stages[idx].stage_mode = e.target.value;
                                handleChange('selection_stages', stages);
                              }}
                            >
                              <MenuItem value="online">Online</MenuItem>
                              <MenuItem value="offline">Offline</MenuItem>
                              <MenuItem value="hybrid">Hybrid</MenuItem>
                            </TextField>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Test Rounds */}
                <Box sx={{ mt: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0A1628', fontSize: '16px' }}>Online / Written Test Rounds</Typography>
                    <Button startIcon={<AddIcon />} onClick={() => handleAddRound('test')}
                      disabled={(formData?.selection_stages || []).filter((s:any) => s.stage_type === 'test').length >= 10}
                      sx={{ color: '#C8922A', fontWeight: 600 }}>Add Test Round</Button>
                  </Box>
                  <Grid container spacing={3}>
                    {(formData?.selection_stages || []).filter((s: any) => s.stage_type === 'test').map((round: any, idx: number) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box sx={{ p: 3, border: '1px solid #C8922A', borderRadius: 2, position: 'relative' }}>
                          <IconButton size="small" onClick={() => handleRemoveRound('test', idx)} sx={{ position: 'absolute', top: 8, right: 8, color: '#ef4444' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ fontWeight: 700, mb: 2, color: '#C8922A', fontSize: '14px' }}>Round {idx + 1}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField select fullWidth size="small" label="Test Type" value={round.test_type || 'Aptitude'}
                                onChange={(e) => { const stages = [...formData.selection_stages]; const si = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx]; stages[si].test_type = e.target.value; handleChange('selection_stages', stages); }}>
                                <MenuItem value="Aptitude">Aptitude</MenuItem>
                                <MenuItem value="Technical">Technical</MenuItem>
                                <MenuItem value="Written">Written</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField fullWidth size="small" type="number" label="Duration (mins)" value={round.duration_minutes || ''}
                                onChange={(e) => { const stages = [...formData.selection_stages]; const si = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx]; stages[si].duration_minutes = parseInt(e.target.value); handleChange('selection_stages', stages); }} />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField select fullWidth size="small" label="Mode" value={round.stage_mode || 'offline'}
                                onChange={(e) => { const stages = [...formData.selection_stages]; const si = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx]; stages[si].stage_mode = e.target.value; handleChange('selection_stages', stages); }}>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="offline">Offline</MenuItem>
                                <MenuItem value="hybrid">Hybrid</MenuItem>
                              </TextField>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Interview Rounds */}
                <Box sx={{ mt: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0A1628', fontSize: '16px' }}>Interview Rounds</Typography>
                    <Button startIcon={<AddIcon />} onClick={() => handleAddRound('interview')}
                      disabled={(formData?.selection_stages || []).filter((s:any) => s.stage_type === 'interview').length >= 10}
                      sx={{ color: '#0A1628', fontWeight: 600 }}>Add Interview Round</Button>
                  </Box>
                  <Grid container spacing={3}>
                    {(formData?.selection_stages || []).filter((s: any) => s.stage_type === 'interview').map((round: any, idx: number) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box sx={{ p: 3, border: '1px solid #0A1628', borderRadius: 2, position: 'relative' }}>
                          <IconButton size="small" onClick={() => handleRemoveRound('interview', idx)} sx={{ position: 'absolute', top: 8, right: 8, color: '#ef4444' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ fontWeight: 700, mb: 2, color: '#0A1628', fontSize: '14px' }}>Interview Round {idx + 1}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField select fullWidth size="small" label="Interview Mode" value={round.interview_mode || 'video_conferencing'}
                                onChange={(e) => { const stages = [...formData.selection_stages]; const si = stages.map((s, i) => s.stage_type === 'interview' ? i : -1).filter(i => i !== -1)[idx]; stages[si].interview_mode = e.target.value; handleChange('selection_stages', stages); }}>
                                <MenuItem value="on_campus">On-campus</MenuItem>
                                <MenuItem value="telephonic">Telephonic</MenuItem>
                                <MenuItem value="video_conferencing">Video Conferencing</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField fullWidth size="small" type="number" label="Duration (mins)" value={round.duration_minutes || ''}
                                onChange={(e) => { const stages = [...formData.selection_stages]; const si = stages.map((s, i) => s.stage_type === 'interview' ? i : -1).filter(i => i !== -1)[idx]; stages[si].duration_minutes = parseInt(e.target.value); handleChange('selection_stages', stages); }} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>

              {/* Infrastructure */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 3 }}>Infrastructure & Logistics</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Team Members Coming" type="number" size="small" value={formData?.selection_infra?.team_members_required || ''}
                      onChange={(e) => handleChange('selection_infra', { ...formData.selection_infra, team_members_required: parseInt(e.target.value) })} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Rooms Required" type="number" size="small" value={formData?.selection_infra?.rooms_required || ''}
                      onChange={(e) => handleChange('selection_infra', { ...formData.selection_infra, rooms_required: parseInt(e.target.value) })} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.1)', p: 1, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '12px' }}>Psychometric Test?</Typography>
                      <Switch size="small" checked={!!formData?.selection_infra?.psychometric_test}
                        onChange={(e) => handleChange('selection_infra', { ...formData.selection_infra, psychometric_test: e.target.checked })} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.1)', p: 1, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '12px' }}>Medical Test?</Typography>
                      <Switch size="small" checked={!!formData?.selection_infra?.medical_test}
                        onChange={(e) => handleChange('selection_infra', { ...formData.selection_infra, medical_test: e.target.checked })} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={2} label="Other Screening Details" value={formData?.selection_infra?.other_screening || ''}
                      onChange={(e) => handleChange('selection_infra', { ...formData.selection_infra, other_screening: e.target.value })} />
                  </Grid>
                </Grid>
              </Box>

              {/* PDF Upload */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 2 }}>Requirement Process Document</Typography>
                <Box sx={{ border: '2px dashed #0A1628', borderRadius: 2, p: 4, textAlign: 'center', bgcolor: 'rgba(10,22,40,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(10,22,40,0.05)', borderColor: '#C8922A' } }}>
                  <input type="file" accept=".pdf" id="selection-pdf" style={{ display: 'none' }} onChange={(e) => setSelectionPdf(e.target.files?.[0] || null)} />
                  <label htmlFor="selection-pdf">
                    <Button component="span" variant="outlined" sx={{ mb: 1, borderColor: '#0A1628', color: '#0A1628' }}>
                      {selectionPdf ? 'Change PDF' : 'Upload Process PDF'}
                    </Button>
                  </label>
                  <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                    {selectionPdf ? `Selected: ${selectionPdf.name}` : (formData?.selection_infra?.selection_process_pdf_path ? 'Process PDF already uploaded' : 'PDF format only, max 5MB')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleSelectionSave} sx={{ bgcolor: '#0A1628', px: 6, py: 1.2, fontWeight: 700, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Selection Process
                </Button>
              </Box>
            </Box>
          )}

          {/* ─── Tab 4: Declaration ─── */}
          {activeTab === 4 && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ color: '#0A1628', fontWeight: 700, mb: 1 }}>Declaration</Typography>
              <Typography sx={{ fontSize: '13px', color: '#5A6478', mb: 3 }}>
                Please review and accept the following terms to complete your Intern Notification Form.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 6 }}>
                {[
                  { id: 'aipc_guidelines', text: 'We have gone through the AIPC guidelines thoroughly and agree to abide by the guidelines during the entire process of placement/internship activities. In case of violation of guidelines by us, we understand that an appropriate action may be taken on us as per AIPC guidelines.' },
                  { id: 'shortlisting_commitment', text: 'We declare that we would be providing the shortlisting criteria along with the CV-shortlisted and/or Test-shortlisted candidates. We also assure that the details of final shortlisted candidates will be provided within the 24 to 48 hours after the written test.' },
                  { id: 'accuracy_profile', text: 'The information related to various job/intern profiles posted by us is verified and correct to the best of our knowledge, and the company will abide by the terms and conditions as outlined in these job/intern profiles posted while making the offers.' },
                  { id: 'consent_ranking_agencies', text: 'We consent to sharing of company name, logo and email with national ranking agencies and government directives, and to listing company names in social media platforms and press/media.' },
                  { id: 'adherence_toc', text: 'I/We confirm that the information pertaining to the posted intern profile is accurate and verified to the best of our knowledge. The company commits to adhere to the terms and conditions outlined in these profiles while extending offers.' },
                ].map((item) => (
                  <Box key={item.id}
                    onClick={() => { const decl = { ...(formData?.declaration || {}), [item.id]: !formData?.declaration?.[item.id] }; handleChange('declaration', decl); }}
                    sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: formData?.declaration?.[item.id] ? '#C8922A' : 'rgba(10, 22, 40, 0.1)', bgcolor: formData?.declaration?.[item.id] ? 'rgba(200, 146, 42, 0.04)' : '#FFF', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 2, '&:hover': { borderColor: '#C8922A', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } }}
                  >
                    <Checkbox checked={!!formData?.declaration?.[item.id]}
                      onMouseDown={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); const decl = { ...(formData?.declaration || {}), [item.id]: e.target.checked }; handleChange('declaration', decl); }}
                      sx={{ p: 0, color: 'rgba(10, 22, 40, 0.3)', '&.Mui-checked': { color: '#C8922A' } }}
                    />
                    <Typography sx={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, userSelect: 'none' }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mb: 6, p: 4, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography sx={{ fontWeight: 700, color: '#0A1628', mb: 3 }}>Signatory Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Signatory Name" size="small" value={formData?.declaration?.signatory_name || ''}
                      onChange={(e) => handleChange('declaration', { ...formData.declaration, signatory_name: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Designation" size="small" value={formData?.declaration?.signatory_designation || ''}
                      onChange={(e) => handleChange('declaration', { ...formData.declaration, signatory_designation: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Digital Signature (Type Full Name)" size="small" placeholder="Type name here" value={formData?.declaration?.typed_signature || ''}
                      onChange={(e) => handleChange('declaration', { ...formData.declaration, typed_signature: e.target.value })} />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 6, p: 3, borderLeft: '4px solid #C8922A', bgcolor: 'rgba(200, 146, 42, 0.05)' }}>
                <Typography sx={{ fontSize: '13px', color: '#5A6478', fontStyle: 'italic', mb: 1 }}>
                  Note: Student&apos;s choices will be governed by the information you provide in this form. Therefore, please be as clear and detailed as possible.
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628', fontWeight: 600 }}>
                  For any queries, you may contact the placement cell.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
                <Button variant="outlined" onClick={handleDeclarationSave}
                  sx={{ borderColor: '#0A1628', color: '#0A1628', px: 4, '&:hover': { borderColor: '#C8922A', bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  Save Draft
                </Button>
                <Button variant="contained"
                  disabled={!formData?.declaration?.aipc_guidelines || !formData?.declaration?.shortlisting_commitment || !formData?.declaration?.accuracy_profile || !formData?.declaration?.consent_ranking_agencies || !formData?.declaration?.adherence_toc || !formData?.declaration?.signatory_name}
                  onClick={handleInfSubmit}
                  sx={{ bgcolor: isChangesRequested ? '#92400E' : '#0A1628', px: 6, py: 1.2, fontWeight: 700, '&:hover': { bgcolor: isChangesRequested ? '#78350F' : '#1B2430' }, '&:disabled': { bgcolor: 'rgba(10,22,40,0.1)' } }}>
                  {isChangesRequested ? '✓ Re-submit After Revision' : 'Confirm & Submit INF'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        </fieldset>

        {/* Request Changes Dialog */}
        <Dialog open={showChangeDialog} onClose={() => setShowChangeDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, color: '#0A1628' }}>Request Changes</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '13px', color: '#5A6478', mb: 2 }}>
              This will change the status to &quot;Changes Requested&quot; and send an email to the company asking them to update the form.
            </Typography>
            <TextField fullWidth multiline rows={4} label="What changes are needed?" placeholder="Please describe the required changes..." 
              value={changeNotes} onChange={(e) => setChangeNotes(e.target.value)}
              sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setShowChangeDialog(false)} sx={{ color: '#5A6478' }}>Cancel</Button>
            <Button variant="contained" disabled={!changeNotes.trim() || requestingChanges}
              onClick={async () => {
                try {
                  setRequestingChanges(true);
                  await adminApi.updateNotificationStatus(parseInt(id), { status: 'changes_requested', review_notes: changeNotes });
                  setFormData((prev: any) => ({ ...prev, status: 'changes_requested' }));
                  setShowChangeDialog(false);
                  setChangeNotes('');
                  setSnackbar({ open: true, message: 'Changes requested — email sent to the company.', severity: 'success' });
                } catch (err) {
                  setSnackbar({ open: true, message: 'Failed to request changes.', severity: 'error' });
                } finally {
                  setRequestingChanges(false);
                }
              }}
              sx={{ bgcolor: '#92400E', '&:hover': { bgcolor: '#78350F' } }}>
              {requestingChanges ? 'Sending...' : 'Send Request & Notify Company'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      {/* AI Auto-Fill Dialog */}
      <AiParsePdfDialog
        open={showAiDialog}
        onClose={() => setShowAiDialog(false)}
        onApply={handleAiApply}
        type="inf"
      />
    </Box>
  );
}
