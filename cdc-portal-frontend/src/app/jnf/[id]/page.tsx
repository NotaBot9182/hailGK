'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, CircularProgress, Grid, TextField, MenuItem, Autocomplete, Chip, Checkbox, FormControlLabel, FormGroup, Switch, Divider, Collapse, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useRouter } from 'next/navigation';
import { notificationsApi, adminApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const JNF_TABS = [
  'Job Profile',
  'Eligibility & Courses',
  'Salary Details',
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

const SALARY_GROUPS = [
  { id: 'btech', label: 'B.Tech / Dual / Int. M.Tech', sourcePrograms: ['B.Tech / B.E (Bachelor of Technology / Engineering)', 'Dual Degree', 'Integrated M.Sc & M.Tech'] },
  { id: 'mtech', label: 'M.Tech', sourcePrograms: ['M.Tech (Master of Technology)'] },
  { id: 'mba', label: 'MBA', sourcePrograms: ['MBA (Master of Business Administration)', 'Executive MBA', 'MBA (Business Analytics)'] },
  { id: 'msc', label: 'M.Sc / M.Sc.Tech', sourcePrograms: ['M.Sc (Master of Science)', 'M.A (Master of Arts)'] },
  { id: 'phd', label: 'Ph.D', isPhd: true }
];

function SalaryTextField({ label, value, onChange, placeholder = "", multiline = false, rows = 1, borderColor = "#0A1628" }: any) {
  return (
    <Box sx={{ mb: 0 }}>
      {label && <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#5A6478', mb: 0.5 }}>{label}</Typography>}
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#FFF',
            fontSize: '13px',
            borderLeft: `3px solid ${borderColor}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            '& fieldset': { borderColor: 'rgba(200, 146, 42, 0.2)' },
            '&:hover fieldset': { borderColor: '#C8922A' },
            '&.Mui-focused fieldset': { borderColor: '#0A1628', borderWidth: '1px' },
          }
        }}
      />
    </Box>
  );
}

const SALARY_COMPONENTS = [
  { 
    category: 'Bonuses & Performance', 
    items: [
      { field: 'joining_bonus', label: 'Joining Bonus', color: '#0A1628', bg: 'rgba(10, 22, 40, 0.03)' },
      { field: 'retention_bonus', label: 'Retention Bonus', color: '#0A1628', bg: 'rgba(10, 22, 40, 0.03)' },
      { field: 'performance_bonus', label: 'Variable / Performance Bonus', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
    ]
  },
  {
    category: 'Stock & Equity',
    items: [
      { field: 'esops', label: 'ESOPs + Vest Period', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
      { field: 'stocks_options', label: 'Stocks / Options', color: '#0A1628', bg: 'rgba(10, 22, 40, 0.03)' },
    ]
  },
  {
    category: 'Allowances & Perks',
    items: [
      { field: 'relocation_allowance', label: 'Relocation Allowance', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
      { field: 'medical_allowance', label: 'Medical Allowance', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
    ]
  },
  {
    category: 'Retention & Deductions',
    items: [
      { field: 'deductions', label: 'Deductions', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
      { field: 'bond_amount', label: 'Bond Amount + Duration', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
    ]
  },
  {
    category: 'Final Salary Figures',
    items: [
      { field: 'first_year_ctc', label: 'First Year CTC', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
      { field: 'gross_salary', label: 'Gross Salary', color: '#C8922A', bg: 'rgba(200, 146, 42, 0.04)' },
      { field: 'ctc_breakup', label: 'CTC Breakup (free text)', color: '#0A1628', bg: 'rgba(10, 22, 40, 0.03)', multiline: true, rows: 2 },
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

export default function JnfFormShell() {
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

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSubmitted = ['submitted', 'under_review', 'approved', 'rejected'].includes(formData?.status || '');
  const isReadOnly = isAdmin || (isSubmitted && formData?.status !== 'changes_requested');

  useEffect(() => {
    if (id) fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        throw new Error('Invalid ID');
      }
      const res = await notificationsApi.get(parsedId);
      const data = res.data.notification;
      
      // Initialize salary fields if missing
      const mapperReverse: Record<string, string> = {
        'btech_dual': 'btech',
        'mtech': 'mtech',
        'mba': 'mba',
        'msc_msctech': 'msc',
        'phd': 'phd',
        'ma': 'ma'
      };

      if (!data.salary_details) {
        data.salary_details = {};
        if (data.salaries && Array.isArray(data.salaries)) {
          data.salaries.forEach((s: any) => {
            const frontKey = mapperReverse[s.programme];
            if (frontKey) {
              data.salary_details[frontKey] = {
                ctc: s.ctc_annual,
                base: s.base_fixed,
                take_home: s.monthly_takehome
              };
              
              // Only parse additional components once from the first salary record 
              // (since UI treats additional components globally per notification)
              if (!data.additional_salary_components) {
                data.additional_salary_components = {
                  joining_bonus: s.joining_bonus,
                  retention_bonus: s.retention_bonus,
                  performance_bonus: s.variable_bonus,
                  esops: s.esop_value,
                  stocks_options: s.stocks_options,
                  relocation_allowance: s.relocation_allowance,
                  medical_allowance: s.medical_allowance,
                  deductions: s.deductions,
                  bond_amount: s.bond_amount,
                  ctc_breakup: s.ctc_breakup,
                  gross_salary: s.gross_salary
                };
                data.salary_currency = s.currency || 'INR';
              }
            }
          });
        }
      }
      
      if (!data.additional_salary_components) data.additional_salary_components = {};
      if (!data.salary_currency) data.salary_currency = 'INR';
      if (data.salary_same_for_all === undefined) data.salary_same_for_all = false;
      
      // Derive included components if missing
      if (!data.included_salary_components) {
        const hasValues = Object.keys(data.additional_salary_components).filter(k => !!data.additional_salary_components[k]);
        data.included_salary_components = hasValues.length > 0 ? hasValues : [];
      }

      // Initialize selection fields if missing
      if (!data.selection_stages) data.selection_stages = [];
      if (!data.selection_infra) data.selection_infra = {
        team_members_required: 0,
        rooms_required: 0,
        psychometric_test: false,
        medical_test: false,
        other_screening: '',
        selection_process_pdf_path: null
      };

      // Initialize declaration fields if missing
      if (!data.declaration) data.declaration = {
        aipc_guidelines: false,
        shortlisting_commitment: false,
        accuracy_profile: false,
        consent_ranking_agencies: false,
        adherence_toc: false,
        rti_nirf_consent: false,
        signatory_name: '',
        signatory_designation: '',
        typed_signature: ''
      };

      // field normalization
      data.job_title = data.job_profile?.profile_name || '';
      data.job_designation = data.job_profile?.designation || '';
      data.place_of_posting = data.job_profile?.place_of_posting || [];
      
      // format work mode back to standard label
      if (data.job_profile?.work_mode === 'on_site') data.work_location_mode = 'On-site';
      else if (data.job_profile?.work_mode === 'remote') data.work_location_mode = 'Remote';
      else if (data.job_profile?.work_mode === 'hybrid') data.work_location_mode = 'Hybrid';
      else data.work_location_mode = 'On-site';

      data.expected_hires = data.job_profile?.expected_hires || '';
      data.minimum_hires = data.job_profile?.min_hires || '';
      data.tentative_joining_month = data.job_profile?.tentative_joining_month ? data.job_profile.tentative_joining_month.substring(0, 7) : '';
      data.required_skills = data.job_profile?.required_skills || [];
      data.job_description = data.job_profile?.job_description || '';
      data.additional_job_info = data.job_profile?.additional_job_info || '';
      data.bond_details = data.job_profile?.bond_details || '';
      data.registration_link = data.job_profile?.registration_link || '';
      data.onboarding_procedure = data.job_profile?.onboarding_procedure || '';

      // Eligibility normalization
      data.min_cpi = data.eligibility_criteria?.min_cgpa || '';
      data.high_school_criterion = data.eligibility_criteria?.hs_percentage || '';
      data.backlogs_allowed = data.eligibility_criteria?.backlogs_allowed || false;
      data.gender_filter = data.eligibility_criteria?.gender_filter || 'all';
      data.phd_allowed = !!data.eligibility_criteria?.phd_allowed;
      data.ma_dhss_allowed = !!data.eligibility_criteria?.ma_dhss_allowed;

      // Extract previously saved courses correctly
      data.eligible_courses = (data.eligibility_criteria?.programmes || []).flatMap((p: any) => {
        // The API sends courses as a JSON string under programmes, we need to parse it if it is a string
        let coursesArray = p.courses || [];
        if (typeof coursesArray === 'string') {
          try {
            coursesArray = JSON.parse(coursesArray);
          } catch (e) {
            coursesArray = [];
          }
        }
        return coursesArray.map((c: string) => `${p.programme_name}|${c}`);
      });

      setFormData(data);
    } catch (err) {
      console.error('Failed to load JNF', err);
      router.push('/dashboard');
      return; // prevent flash of broken state
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

  const handleSalaryChange = (groupId: string, field: string, value: any) => {
    const current = { ...(formData?.salary_details || {}) };
    
    if (formData?.salary_same_for_all) {
      // Apply to all active groups
      const updated = { ...current };
      getActiveSalaryGroups().forEach(g => {
        if (!updated[g.id]) updated[g.id] = {};
        updated[g.id][field] = value;
      });
      handleChange('salary_details', updated);
    } else {
      if (!current[groupId]) current[groupId] = {};
      current[groupId][field] = value;
      handleChange('salary_details', current);
    }
  };

  const handleAdditionalSalaryChange = (field: string, value: any) => {
    const current = { ...(formData?.additional_salary_components || {}) };
    current[field] = value;
    handleChange('additional_salary_components', current);
  };

  const handleToggleComponent = (field: string) => {
    const current = formData?.included_salary_components || [];
    if (current.includes(field)) {
      handleChange('included_salary_components', current.filter((c: string) => c !== field));
    } else {
      handleChange('included_salary_components', [...current, field]);
    }
  };

  const handleSelectionStageToggle = (type: string, enabled: boolean) => {
    let current = [...(formData?.selection_stages || [])];
    if (enabled) {
      if (!current.some(s => s.stage_type === type)) {
        current.push({
          stage_type: type,
          stage_mode: 'offline',
          is_enabled: true,
          sort_order: current.length
        });
      }
    } else {
      current = current.filter(s => s.stage_type !== type);
    }
    handleChange('selection_stages', current);
  };

  const handleAddRound = (type: string) => {
    const current = [...(formData?.selection_stages || [])];
    const rounds = current.filter(s => s.stage_type === type);
    if (rounds.length < 10) {
      current.push({
        stage_type: type,
        stage_mode: 'offline',
        test_type: type === 'test' ? 'Aptitude' : null,
        interview_mode: type === 'interview' ? 'video_conferencing' : null,
        duration_minutes: 60,
        is_enabled: true,
        sort_order: current.length
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

  const handleJobProfileSave = async () => {
    try {
      console.log('Saving Job Profile...', formData);
      setSavingStatus('saving');
      const safeInt = (v: any) => (v !== null && v !== undefined && v !== '' && !isNaN(parseInt(v))) ? parseInt(v) : null;
      
      const payload = {
        profile_name: formData.job_title || '',
        designation: formData.job_designation || '',
        place_of_posting: (Array.isArray(formData.place_of_posting) && formData.place_of_posting.length > 0) 
          ? formData.place_of_posting 
          : [formData.place_of_posting || 'TBD'].filter(Boolean),
        work_mode: (formData.work_location_mode || 'on_site').toLowerCase().replace('-', '_').replace(' ', '_'),
        expected_hires: safeInt(formData.expected_hires),
        min_hires: safeInt(formData.minimum_hires),
        tentative_joining_month: formData.tentative_joining_month ? `${formData.tentative_joining_month}-01` : '2026-07-01',
        required_skills: formData.required_skills || [],
        job_description: formData.job_description || '',
        additional_job_info: formData.additional_job_info || '',
        bond_details: formData.bond_details || '',
        registration_link: formData.registration_link || '',
        onboarding_procedure: formData.onboarding_procedure || '',
      };
      
      console.log('Job Profile Payload:', payload);
      await notificationsApi.updateJobProfile(parseInt(id), payload);
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Job Profile saved successfully!', severity: 'success' });
    } catch (error: any) {
      console.error('Job Profile Save Error:', error.response?.data || error);
      setSavingStatus('error');
      const errorMsg = error.response?.data?.message || 'Failed to save Job Profile. Please check required fields.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
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

      console.log('Eligibility Payload:', payload);
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

  const handleSalarySave = async () => {
    try {
      setSavingStatus('saving');
      const safeFloat = (v: any) => (v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v))) ? parseFloat(v) : null;
      
      const mapper: Record<string, string> = {
        'btech': 'btech_dual',
        'mtech': 'mtech',
        'mba': 'mba',
        'msc': 'msc_msctech',
        'phd': 'phd',
        'ma': 'ma'
      };

      const salaries = Object.entries(formData.salary_details || {}).map(([key, details]: [string, any]) => {
        const backendKey = mapper[key];
        if (!backendKey) return null;

        return {
          programme: backendKey,
          ctc_annual: safeFloat(details.ctc),
          base_fixed: safeFloat(details.base),
          monthly_takehome: safeFloat(details.take_home),
          joining_bonus: safeFloat(formData.additional_salary_components?.joining_bonus),
          retention_bonus: safeFloat(formData.additional_salary_components?.retention_bonus),
          variable_bonus: safeFloat(formData.additional_salary_components?.performance_bonus),
          esop_value: safeFloat(formData.additional_salary_components?.esops),
          stocks_options: safeFloat(formData.additional_salary_components?.stocks_options),
          relocation_allowance: safeFloat(formData.additional_salary_components?.relocation_allowance),
          medical_allowance: safeFloat(formData.additional_salary_components?.medical_allowance),
          deductions: formData.additional_salary_components?.deductions || '',
          bond_amount: safeFloat(formData.additional_salary_components?.bond_amount),
          ctc_breakup: formData.additional_salary_components?.ctc_breakup || '',
          gross_salary: safeFloat(formData.additional_salary_components?.gross_salary),
          currency: formData.salary_currency || 'INR'
        };
      }).filter(Boolean);

      console.log('Salary Payload:', { salaries });
      await notificationsApi.updateSalary(parseInt(id), { salaries });
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Salary details saved!', severity: 'success' });
    } catch (error: any) {
      console.error('Salary Save Error:', error.response?.data || error);
      setSavingStatus('error');
      const msg = error.response?.data?.message || 'Failed to save salary details';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleSelectionSave = async () => {
    try {
      setSavingStatus('saving');
      
      const normalizedStages = (formData.selection_stages || []).map((stage: any) => ({
        ...stage,
        stage_mode: (stage.stage_mode || 'online').toLowerCase(),
        stage_type: (stage.stage_type || 'Test').replace(' ', '_'),
      }));

      const payload = {
        stages: normalizedStages,
        infra: formData.selection_infra || {}
      };

      console.log('Selection Payload:', payload);
      await notificationsApi.updateSelection(parseInt(id), payload);

      if (selectionPdf) {
        await notificationsApi.uploadSelectionPdf(parseInt(id), selectionPdf);
      }
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Selection process saved!', severity: 'success' });
    } catch (err: any) {
      console.error('Selection Save Error:', err.response?.data || err);
      setSavingStatus('error');
      const msg = err.response?.data?.message || 'Failed to save selection process';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleDeclarationSave = async () => {
    try {
      console.log('Saving Declaration...', formData?.declaration);
      setSavingStatus('saving');
      await notificationsApi.updateDeclaration(parseInt(id), formData?.declaration || {});
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'Declaration saved!', severity: 'success' });
    } catch (err: any) {
      console.error('Declaration Save Error:', err.response?.data || err);
      setSavingStatus('error');
      setSnackbar({ open: true, message: 'Failed to save declaration', severity: 'error' });
    }
  };

  const handleJnfSubmit = async () => {
    try {
      setSavingStatus('saving');
      // Save declaration first to be sure
      await notificationsApi.updateDeclaration(parseInt(id), formData?.declaration || {});
      const res = await notificationsApi.submit(parseInt(id));
      setSavingStatus('saved');
      setSnackbar({ open: true, message: 'JNF submitted successfully!', severity: 'success' });
      // Redirect to dashboard after a short delay
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      console.error('Submit Error:', err.response?.data || err);
      setSavingStatus('error');
      const msg = err.response?.data?.message || 'Failed to submit JNF. Please ensure all sections are complete.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleSameForAllToggle = (checked: boolean) => {
    handleChange('salary_same_for_all', checked);
    if (checked) {
      const activeGroups = getActiveSalaryGroups();
      if (activeGroups.length > 1) {
        const firstGroupId = activeGroups[0].id;
        const firstGroupSal = formData?.salary_details?.[firstGroupId] || {};
        const updatedSal = { ...(formData?.salary_details || {}) };
        activeGroups.forEach(g => {
          updatedSal[g.id] = { ...firstGroupSal };
        });
        handleChange('salary_details', updatedSal);
      }
    }
  };

  const getActiveSalaryGroups = () => {
    const selectedCourses = formData?.eligible_courses || [];
    return SALARY_GROUPS.filter(group => {
      if (group.isPhd) return !!formData?.phd_allowed;
      // In the unique key system, we check if any course ID starts with the source program title
      return group.sourcePrograms?.some(progTitle => 
        selectedCourses.some((cId: string) => cId.startsWith(`${progTitle}|`))
      );
    });
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
          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Job Notification Form (JNF)</Typography>
          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Reference: {formData?.reference_number || `JNF-${id}`}
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
              You are viewing this {formData?.type?.toUpperCase() || 'JNF'} as an admin. Fields are read-only.
            </Typography>
          </Box>
          {['submitted', 'under_review'].includes(formData?.status || '') && (
            <Button size="small" variant="contained"
              onClick={() => setShowChangeDialog(true)}
              sx={{ bgcolor: '#92400E', fontSize: '12px', fontWeight: 600, '&:hover': { bgcolor: '#78350F' } }}>
              Request Changes
            </Button>
          )}
        </Box>
      )}

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
          {JNF_TABS.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area (Phase 3 implementation for Job Profile tab, placeholders for others) */}
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
            {JNF_TABS[activeTab]}
          </Typography>

          {activeTab === 0 && (
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Profile Name / Job Title *" size="small" value={formData?.job_title || ''} onChange={(e) => handleChange('job_title', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Job Designation (formal)" size="small" value={formData?.job_designation || ''} onChange={(e) => handleChange('job_designation', e.target.value)} />
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

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label="Expected Hires *" type="number" size="small" value={formData?.expected_hires || ''} onChange={(e) => handleChange('expected_hires', e.target.value)} />
                    <TextField fullWidth label="Minimum Hires" type="number" size="small" value={formData?.minimum_hires || ''} onChange={(e) => handleChange('minimum_hires', e.target.value)} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Tentative Joining Month *" 
                    type="month" 
                    size="small" 
                    InputLabelProps={{ shrink: true }} 
                    value={formData?.tentative_joining_month || ''} 
                    onChange={(e) => handleChange('tentative_joining_month', e.target.value)} 
                  />
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
                    fullWidth 
                    multiline 
                    rows={4} 
                    label="Job Description" 
                    size="small" 
                    helperText="Provide full description. Alternatively, you can upload a PDF below." 
                    value={formData?.job_description || ''} 
                    onChange={(e) => handleChange('job_description', e.target.value)} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={3} 
                    label="Additional Job Info" 
                    size="small" 
                    inputProps={{ maxLength: 1000 }} 
                    helperText="Maximum 1000 characters" 
                    value={formData?.additional_job_info || ''} 
                    onChange={(e) => handleChange('additional_job_info', e.target.value)} 
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth multiline rows={2} label="Bond Details" size="small" value={formData?.bond_details || ''} onChange={(e) => handleChange('bond_details', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Registration Link" size="small" helperText="Company's own link (if any)" value={formData?.registration_link || ''} onChange={(e) => handleChange('registration_link', e.target.value)} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Onboarding Procedure" size="small" value={formData?.onboarding_procedure || ''} onChange={(e) => handleChange('onboarding_procedure', e.target.value)} />
                </Grid>
              </Grid>

              <Box sx={{ 
                mt: 4, 
                p: 3, 
                border: '2px dashed #C8922A', 
                borderRadius: 2, 
                bgcolor: 'rgba(200, 146, 42, 0.05)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2
              }}>
                <Typography sx={{ fontWeight: 600, color: '#0A1628' }}>
                  Alternative: Upload Job Description (PDF)
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#5A6478', mt: -1, textAlign: 'center' }}>
                  If you have a pre-formatted job description document, you can upload it here directly instead of filling the text fields.
                </Typography>
                <Button variant="contained" component="label" sx={{ bgcolor: '#C8922A', color: '#1B2430', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#E8B64A' } }}>
                  Browse PDF File
                  <input type="file" hidden accept="application/pdf" />
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleJobProfileSave} sx={{ bgcolor: '#0A1628', px: 4, py: 1, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Job Profile
                </Button>
              </Box>
            </Box>
          )}

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
                          fullWidth 
                          size="small" 
                          label="Specify required departments" 
                          sx={{ mt: 2 }}
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
                      <TextField 
                        fullWidth 
                        label="Per-discipline Min. CPI" 
                        size="small" 
                        type="number"
                        inputProps={{ step: "0.1", max: "10", min: "0" }}
                        value={formData?.min_cpi || ''}
                        onChange={(e) => handleChange('min_cpi', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <TextField 
                        fullWidth 
                        label="High School % Criterion" 
                        size="small" 
                        type="number"
                        value={formData?.high_school_criterion || ''}
                        onChange={(e) => handleChange('high_school_criterion', e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField 
                        fullWidth 
                        select
                        label="Gender Filter" 
                        size="small" 
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

          {activeTab === 2 && (
            <Box sx={{ mt: 2 }}>
              {/* Header with Currency and Same Structure Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#C8922A', px: 2, py: 0.8, borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Typography sx={{ color: '#FEFEFE', fontWeight: 600, fontSize: '13px' }}>★ Currency Selector:</Typography>
                  <Typography sx={{ color: '#FEFEFE', fontWeight: 500, fontSize: '13px' }}>
                    {['INR', 'USD', 'EUR'].map((curr, idx) => (
                      <span key={curr} 
                        style={{ cursor: 'pointer', textDecoration: (formData?.salary_currency || 'INR') === curr ? 'underline' : 'none', fontWeight: (formData?.salary_currency || 'INR') === curr ? 700 : 500 }}
                        onClick={() => handleChange('salary_currency', curr)}
                      >
                        {curr}{idx < 2 ? ' / ' : ''}
                      </span>
                    ))}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#107B4F', color: '#FFF', px: 2, py: 0.8, borderRadius: 1, gap: 1 }}>
                  <Checkbox 
                    size="small" 
                    checked={!!formData?.salary_same_for_all} 
                    onChange={(e) => handleSameForAllToggle(e.target.checked)}
                    sx={{ color: '#FFF', '&.Mui-checked': { color: '#FFF' }, p: 0 }} 
                  />
                  <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Same structure for all programmes</Typography>
                </Box>
              </Box>

              {/* Salary Table */}
              <Box sx={{ border: '1px solid rgba(10,22,40,0.15)', borderRadius: 1.5, overflow: 'hidden', mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', bgcolor: '#0A1628', color: '#FFF', py: 1.8, px: 2 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#C8922A' }}>PROGRAMME</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>CTC (Annual)</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Base/Fixed</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Monthly Take-home</Typography>
                </Box>
                
                {getActiveSalaryGroups().length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Typography sx={{ color: '#5A6478', fontSize: '14px' }}>
                      No programs selected in "Eligibility & Courses". Please select programs first.
                    </Typography>
                  </Box>
                ) : (
                  getActiveSalaryGroups().map((group, idx) => (
                    <Box key={group.id} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 1fr 1fr 1.2fr', 
                      px: 2, 
                      py: 2, 
                      alignItems: 'center',
                      borderTop: idx > 0 ? '1px solid rgba(10,22,40,0.05)' : 'none',
                      bgcolor: idx % 2 === 1 ? 'rgba(244,246,249,0.3)' : 'transparent'
                    }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#0A1628' }}>{group.label}</Typography>
                      <Box sx={{ px: 0.5 }}><SalaryTextField borderColor="#C8922A" value={formData?.salary_details?.[group.id]?.ctc} onChange={(val: string) => handleSalaryChange(group.id, 'ctc', val)} /></Box>
                      <Box sx={{ px: 0.5 }}><SalaryTextField borderColor="#C8922A" value={formData?.salary_details?.[group.id]?.base} onChange={(val: string) => handleSalaryChange(group.id, 'base', val)} /></Box>
                      <Box sx={{ px: 0.5 }}><SalaryTextField borderColor="#C8922A" value={formData?.salary_details?.[group.id]?.take_home} onChange={(val: string) => handleSalaryChange(group.id, 'take_home', val)} /></Box>
                    </Box>
                  ))
                )}
              </Box>

              {/* Additional Components */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ bgcolor: '#0A1628', color: '#FFF', py: 1.2, px: 2, fontSize: '13px', fontWeight: 600, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                  ADDITIONAL SALARY COMPONENTS (Select which ones to include)
                </Typography>
                
                <Box sx={{ p: 3, border: '1px solid rgba(10,22,40,0.1)', borderTop: 'none', bgcolor: 'rgba(10, 22, 40, 0.01)' }}>
                   {SALARY_COMPONENTS.map((cat, catIdx) => (
                      <Box key={catIdx} sx={{ mb: catIdx < SALARY_COMPONENTS.length - 1 ? 2.5 : 0 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#C8922A', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {cat.category}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {cat.items.map((comp) => (
                            <Chip
                              key={comp.field}
                              label={comp.label}
                              onClick={() => handleToggleComponent(comp.field)}
                              variant={(formData?.included_salary_components || []).includes(comp.field) ? 'filled' : 'outlined'}
                              sx={{
                                fontSize: '11px',
                                height: '24px',
                                fontWeight: 600,
                                bgcolor: (formData?.included_salary_components || []).includes(comp.field) ? '#0A1628' : 'transparent',
                                color: (formData?.included_salary_components || []).includes(comp.field) ? '#FEFEFE' : '#5A6478',
                                borderColor: (formData?.included_salary_components || []).includes(comp.field) ? '#0A1628' : 'rgba(0,0,0,0.1)',
                                '&:hover': {
                                  bgcolor: (formData?.included_salary_components || []).includes(comp.field) ? '#1B2430' : 'rgba(0,0,0,0.05)',
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                   ))}
                </Box>

                <Box sx={{ p: 4, border: '1px solid rgba(10,22,40,0.15)', borderTop: 'none', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, bgcolor: 'rgba(244, 246, 249, 0.4)', minHeight: 100 }}>
                   {SALARY_COMPONENTS.map((cat, catIdx) => {
                      const activeItems = cat.items.filter(comp => (formData?.included_salary_components || []).includes(comp.field));
                      if (activeItems.length === 0) return null;
                      
                      return (
                        <Box key={catIdx} sx={{ mb: 4 }}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0A1628', mb: 2.5, borderBottom: '2px solid #C8922A', display: 'inline-block', pb: 0.5 }}>
                            {cat.category}
                          </Typography>
                          <Grid container spacing={3}>
                            {activeItems.map((comp: any) => (
                              <Grid item xs={12} sm={6} md={4} key={comp.field}>
                                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: comp.bg, border: '1px solid rgba(0,0,0,0.02)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } }}>
                                  <SalaryTextField 
                                    label={comp.label} 
                                    value={formData?.additional_salary_components?.[comp.field]} 
                                    onChange={(val: string) => handleAdditionalSalaryChange(comp.field, val)} 
                                    borderColor={comp.color}
                                    multiline={comp.multiline}
                                    rows={comp.rows}
                                  />
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      );
                   })}
                   
                    {(formData?.included_salary_components || []).length === 0 && (
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Typography sx={{ color: '#5A6478', fontSize: '13px', fontStyle: 'italic' }}>
                          Select components from the list above to provide their details.
                        </Typography>
                      </Box>
                    )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={handleSalarySave} sx={{ bgcolor: '#0A1628', px: 4, py: 1, '&:hover': { bgcolor: '#2C3345' }}}>
                  Save Salary Details
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
            <Box sx={{ mt: 2 }}>
              {/* Stages Section */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Selection Stages & Rounds
                </Typography>

                <Grid container spacing={4}>
                  {[
                    { id: 'ppt', label: 'Pre-Placement Talk', type: 'ppt' },
                    { id: 'resume', label: 'Resume Shortlisting', type: 'resume' },
                    { id: 'gd', label: 'Group Discussion', type: 'gd' },
                  ].map((stage) => {
                    const activeStage = (formData?.selection_stages || []).find((s: any) => s.stage_type === stage.id);
                    return (
                      <Grid item xs={12} md={4} key={stage.id}>
                        <Box sx={{ p: 3, border: '1px solid rgba(10,22,40,0.1)', borderRadius: 2, bgcolor: activeStage ? 'rgba(200, 146, 42, 0.03)' : 'rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 600, color: '#0A1628' }}>{stage.label}</Typography>
                            <Switch 
                              checked={!!activeStage} 
                              onChange={(e) => handleSelectionStageToggle(stage.id, e.target.checked)} 
                            />
                          </Box>
                          {activeStage && (
                            <TextField
                              select
                              fullWidth
                              size="small"
                              label="Selection Mode"
                              value={activeStage.stage_mode || 'offline'}
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
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={() => handleAddRound('test')}
                      disabled={(formData?.selection_stages || []).filter((s:any) => s.stage_type === 'test').length >= 10}
                      sx={{ color: '#C8922A', fontWeight: 600 }}
                    >
                      Add Test Round
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {(formData?.selection_stages || []).filter((s: any) => s.stage_type === 'test').map((round: any, idx: number) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box sx={{ p: 3, border: '1px solid #C8922A', borderRadius: 2, position: 'relative' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveRound('test', idx)}
                            sx={{ position: 'absolute', top: 8, right: 8, color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ fontWeight: 700, mb: 2, color: '#C8922A', fontSize: '14px' }}>Round {idx + 1}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label="Test Type"
                                value={round.test_type || 'Aptitude'}
                                onChange={(e) => {
                                  const stages = [...formData.selection_stages];
                                  const stageIdx = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx];
                                  stages[stageIdx].test_type = e.target.value;
                                  handleChange('selection_stages', stages);
                                }}
                              >
                                <MenuItem value="Aptitude">Aptitude</MenuItem>
                                <MenuItem value="Technical">Technical</MenuItem>
                                <MenuItem value="Written">Written</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Duration (mins)"
                                value={round.duration_minutes || ''}
                                onChange={(e) => {
                                  const stages = [...formData.selection_stages];
                                  const stageIdx = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx];
                                  stages[stageIdx].duration_minutes = parseInt(e.target.value);
                                  handleChange('selection_stages', stages);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label="Mode"
                                value={round.stage_mode || 'offline'}
                                onChange={(e) => {
                                  const stages = [...formData.selection_stages];
                                  const stageIdx = stages.map((s, i) => s.stage_type === 'test' ? i : -1).filter(i => i !== -1)[idx];
                                  stages[stageIdx].stage_mode = e.target.value;
                                  handleChange('selection_stages', stages);
                                }}
                              >
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
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={() => handleAddRound('interview')}
                      disabled={(formData?.selection_stages || []).filter((s:any) => s.stage_type === 'interview').length >= 10}
                      sx={{ color: '#0A1628', fontWeight: 600 }}
                    >
                      Add Interview Round
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {(formData?.selection_stages || []).filter((s: any) => s.stage_type === 'interview').map((round: any, idx: number) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box sx={{ p: 3, border: '1px solid #0A1628', borderRadius: 2, position: 'relative' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveRound('interview', idx)}
                            sx={{ position: 'absolute', top: 8, right: 8, color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ fontWeight: 700, mb: 2, color: '#0A1628', fontSize: '14px' }}>Interview Round {idx + 1}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label="Interview Mode"
                                value={round.interview_mode || 'video_conferencing'}
                                onChange={(e) => {
                                  const stages = [...formData.selection_stages];
                                  const stageIdx = stages.map((s, i) => s.stage_type === 'interview' ? i : -1).filter(i => i !== -1)[idx];
                                  stages[stageIdx].interview_mode = e.target.value;
                                  handleChange('selection_stages', stages);
                                }}
                              >
                                <MenuItem value="on_campus">On-campus</MenuItem>
                                <MenuItem value="telephonic">Telephonic</MenuItem>
                                <MenuItem value="video_conferencing">Video Conferencing</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Duration (mins)"
                                value={round.duration_minutes || ''}
                                onChange={(e) => {
                                  const stages = [...formData.selection_stages];
                                  const stageIdx = stages.map((s, i) => s.stage_type === 'interview' ? i : -1).filter(i => i !== -1)[idx];
                                  stages[stageIdx].duration_minutes = parseInt(e.target.value);
                                  handleChange('selection_stages', stages);
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>

              {/* Infrastructure & Logistics */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 3 }}>Infrastructure & Logistics</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField 
                      fullWidth 
                      label="Team Members Content" 
                      type="number"
                      size="small"
                      value={formData?.selection_infra?.team_members_required || ''}
                      onChange={(e) => {
                        const infra = { ...formData.selection_infra, team_members_required: parseInt(e.target.value) };
                        handleChange('selection_infra', infra);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField 
                      fullWidth 
                      label="Rooms Required" 
                      type="number"
                      size="small"
                      value={formData?.selection_infra?.rooms_required || ''}
                      onChange={(e) => {
                        const infra = { ...formData.selection_infra, rooms_required: parseInt(e.target.value) };
                        handleChange('selection_infra', infra);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.1)', p: 1, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '12px' }}>Psychometric Test?</Typography>
                      <Switch 
                        size="small"
                        checked={!!formData?.selection_infra?.psychometric_test}
                        onChange={(e) => {
                          const infra = { ...formData.selection_infra, psychometric_test: e.target.checked };
                          handleChange('selection_infra', infra);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(0,0,0,0.1)', p: 1, borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '12px' }}>Medical Test?</Typography>
                      <Switch 
                        size="small"
                        checked={!!formData?.selection_infra?.medical_test}
                        onChange={(e) => {
                          const infra = { ...formData.selection_infra, medical_test: e.target.checked };
                          handleChange('selection_infra', infra);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={2} 
                      label="Other Screening Details" 
                      value={formData?.selection_infra?.other_screening || ''}
                      onChange={(e) => {
                        const infra = { ...formData.selection_infra, other_screening: e.target.value };
                        handleChange('selection_infra', infra);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* PDF Upload */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ color: '#0A1628', fontWeight: 700, fontSize: '18px', mb: 2 }}>Requirement Process Document</Typography>
                <Box 
                  sx={{ 
                    border: '2px dashed #0A1628', 
                    borderRadius: 2, 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'rgba(10, 22, 40, 0.02)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(10, 22, 40, 0.05)', borderColor: '#C8922A' }
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    id="selection-pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setSelectionPdf(e.target.files?.[0] || null)}
                  />
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

          {activeTab === 4 && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ color: '#0A1628', fontWeight: 700, mb: 1 }}>Declaration</Typography>
              <Typography sx={{ fontSize: '13px', color: '#5A6478', mb: 3 }}>
                Please review and accept the following terms to complete your Job Notification Form.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 6 }}>
                {/* Declaration Block */}
                {[
                  { 
                    id: 'aipc_guidelines', 
                    text: 'We have gone through the AIPC guidelines thoroughly and agree to abide by the guidelines during the entire process of placement/internship activities. In case of violation of guidelines by us, we understand that an appropriate action may be taken on us as per AIPC guidelines.' 
                  },
                  { 
                    id: 'shortlisting_commitment', 
                    text: 'We declare that we would be providing the shortlisting criteria along with the CV-shortlisted and/or Test-shortlisted candidates. We also assure that the details of final shortlisted candidates will be provided within the 24 to 48 hours after the written test.' 
                  },
                  { 
                    id: 'accuracy_profile', 
                    text: 'The information related to various job/intern profiles posted by us is verified and correct to the best of our knowledge, and the company will abide by the terms and conditions as outlined in these job/intern profiles posted while making the offers. No new clauses/ changes would be added/made in the final offer rolled out to the candidates selected on the profile(s).' 
                  },
                  { 
                    id: 'consent_ranking_agencies', 
                    text: 'We consent to sharing of company name, logo and email with national ranking agencies and government directives, and to listing company names in social media platforms and press/media.' 
                  },
                  { 
                    id: 'adherence_toc', 
                    text: 'I/We confirm that the information pertaining to the posted job profile is accurate and verified to the best of our knowledge. The company commits to adhere to the terms and conditions outlined in these job profiles while extending offers. No additional clauses or changes will be introduced in the final offers extended to the candidates selected for the respective profiles.' 
                  },
                ].map((item) => (
                  <Box 
                    key={item.id}
                    onClick={() => {
                      const currentVal = !!formData?.declaration?.[item.id];
                      const decl = { ...(formData?.declaration || {}), [item.id]: !currentVal };
                      handleChange('declaration', decl);
                    }}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2, 
                      border: '1px solid',
                      borderColor: formData?.declaration?.[item.id] ? '#C8922A' : 'rgba(10, 22, 40, 0.1)',
                      bgcolor: formData?.declaration?.[item.id] ? 'rgba(200, 146, 42, 0.04)' : '#FFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      '&:hover': {
                        borderColor: '#C8922A',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Checkbox 
                      checked={!!formData?.declaration?.[item.id]} 
                      onMouseDown={(e) => e.stopPropagation()} // Stop focus/click issues
                      onChange={(e) => {
                        e.stopPropagation();
                        // The Box onClick also fires if we don't handle this carefully
                        // But with stopPropagation on the checkbox, only this fires
                        const decl = { ...(formData?.declaration || {}), [item.id]: e.target.checked };
                        handleChange('declaration', decl);
                      }}
                      sx={{ p: 0, color: 'rgba(10, 22, 40, 0.3)', '&.Mui-checked': { color: '#C8922A' } }}
                    />
                    <Typography sx={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, userSelect: 'none' }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mb: 6, p: 4, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography sx={{ fontWeight: 700, color: '#0A1628', mb: 3 }}>Signatory Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="Signatory Name" 
                      size="small"
                      value={formData?.declaration?.signatory_name || ''}
                      onChange={(e) => {
                        const decl = { ...formData.declaration, signatory_name: e.target.value };
                        handleChange('declaration', decl);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="Designation" 
                      size="small"
                      value={formData?.declaration?.signatory_designation || ''}
                      onChange={(e) => {
                        const decl = { ...formData.declaration, signatory_designation: e.target.value };
                        handleChange('declaration', decl);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="Digital Signature (Type Full Name)" 
                      size="small"
                      placeholder="Type name here"
                      value={formData?.declaration?.typed_signature || ''}
                      onChange={(e) => {
                        const decl = { ...formData.declaration, typed_signature: e.target.value };
                        handleChange('declaration', decl);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 6, p: 3, borderLeft: '4px solid #C8922A', bgcolor: 'rgba(200, 146, 42, 0.05)' }}>
                <Typography sx={{ fontSize: '13px', color: '#5A6478', fontStyle: 'italic', mb: 1 }}>
                  Note: Student’s choices will be governed by the information you provide in this form. Therefore, please be as clear and detailed as possible. Before filling the form kindly refer to the placement brochure and placement website for the selection process and rules & regulations.
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#0A1628', fontWeight: 600 }}>
                  For any queries, you may contact the placement cell.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleDeclarationSave} 
                  sx={{ borderColor: '#0A1628', color: '#0A1628', px: 4, '&:hover': { borderColor: '#C8922A', bgcolor: 'rgba(0,0,0,0.02)' } }}
                >
                  Save Draft
                </Button>
                <Button 
                  variant="contained" 
                  disabled={!formData?.declaration?.aipc_guidelines || !formData?.declaration?.shortlisting_commitment || !formData?.declaration?.accuracy_profile || !formData?.declaration?.consent_ranking_agencies || !formData?.declaration?.adherence_toc || !formData?.declaration?.signatory_name}
                  onClick={handleJnfSubmit} 
                  sx={{ 
                    bgcolor: '#0A1628', 
                    px: 6, 
                    py: 1.2, 
                    fontWeight: 700, 
                    '&:hover': { bgcolor: '#1B2430' },
                    '&:disabled': { bgcolor: 'rgba(10,22,40,0.1)' }
                  }}
                >
                  Confirm & Submit JNF
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
      </Box>
  );
}
