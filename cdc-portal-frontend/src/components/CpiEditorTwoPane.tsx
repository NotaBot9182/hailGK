'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
} from '@mui/material';

export interface CpiEditorTwoPaneProps {
  eligibleCourses: string[];
  courseCpis: Record<string, string>;
  onCourseCpisChange: (next: Record<string, string>) => void;
}

function parseCourseId(courseId: string): { programmeTitle: string; courseName: string } {
  const idx = courseId.indexOf('|');
  if (idx === -1) return { programmeTitle: '', courseName: courseId };
  return {
    programmeTitle: courseId.slice(0, idx),
    courseName: courseId.slice(idx + 1),
  };
}

function safeFloat(v: string): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export default function CpiEditorTwoPane({ eligibleCourses, courseCpis, onCourseCpisChange }: CpiEditorTwoPaneProps) {
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState<string>(''); // '' = all
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = [...(eligibleCourses || [])];
    list.sort((a, b) => {
      const A = parseCourseId(a);
      const B = parseCourseId(b);
      const p = A.programmeTitle.localeCompare(B.programmeTitle);
      if (p !== 0) return p;
      return A.courseName.localeCompare(B.courseName);
    });
    return list.map((courseId) => {
      const { programmeTitle, courseName } = parseCourseId(courseId);
      const cpiStr = courseCpis?.[courseId] || '';
      const missing = safeFloat(cpiStr) === null;
      return { courseId, programmeTitle, courseName, cpiStr, missing };
    });
  }, [eligibleCourses, courseCpis]);

  const programmeTitles = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => {
      if (r.programmeTitle) s.add(r.programmeTitle);
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  // If programme list changes, reset invalid filter
  useEffect(() => {
    if (!programmeFilter) return;
    if (!programmeTitles.includes(programmeFilter)) setProgrammeFilter('');
  }, [programmeFilter, programmeTitles]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (programmeFilter && r.programmeTitle !== programmeFilter) return false;
      if (!q) return true;
      return (
        r.courseName.toLowerCase().includes(q) ||
        r.programmeTitle.toLowerCase().includes(q) ||
        r.courseId.toLowerCase().includes(q)
      );
    });
  }, [rows, search, programmeFilter]);

  const missingInView = useMemo(() => filteredRows.filter((r) => r.missing).length, [filteredRows]);

  const setCpiForCourse = useCallback(
    (courseId: string, value: string) => {
      const next = { ...(courseCpis || {}) };
      if (value) next[courseId] = value;
      else delete next[courseId];
      onCourseCpisChange(next);
    },
    [courseCpis, onCourseCpisChange]
  );

  const activeIndex = useMemo(() => {
    if (!activeCourseId) return -1;
    return filteredRows.findIndex((r) => r.courseId === activeCourseId);
  }, [activeCourseId, filteredRows]);

  const activeRow = activeCourseId ? filteredRows.find((r) => r.courseId === activeCourseId) : null;

  useEffect(() => {
    if (filteredRows.length === 0) {
      setActiveCourseId(null);
      return;
    }
    if (!activeCourseId || !filteredRows.some((r) => r.courseId === activeCourseId)) {
      setActiveCourseId(filteredRows[0].courseId);
    }
  }, [filteredRows, activeCourseId]);

  const goPrevNext = (dir: -1 | 1) => {
    if (filteredRows.length === 0) return;
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const nextIdx = Math.min(filteredRows.length - 1, Math.max(0, idx + dir));
    setActiveCourseId(filteredRows[nextIdx].courseId);
  };

  if (!eligibleCourses?.length) {
    return (
      <Box sx={{ mb: 3, p: 2.5, borderRadius: 2, border: '1px solid rgba(10,22,40,0.10)', bgcolor: '#FEFEFE' }}>
        <Typography sx={{ fontWeight: 700, color: '#0A1628', fontSize: '14px', mb: 0.5 }}>CPI (individual courses)</Typography>
        <Typography sx={{ fontSize: '12.5px', color: '#94A3B8', fontStyle: 'italic' }}>
          No courses selected yet. Select courses below first.
        </Typography>
      </Box>
    );
  }

  const posLabel =
    activeIndex >= 0 && filteredRows.length > 0 ? `${activeIndex + 1} / ${filteredRows.length}` : '—';

  return (
    <Box sx={{ mb: 3, p: 2, borderRadius: 2, border: '1px solid rgba(10,22,40,0.10)', bgcolor: '#FEFEFE' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0A1628', fontSize: '14px' }}>CPI (individual courses)</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', mt: 0.25 }}>
            Pick a course on the left, enter CPI on the right.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '12px', color: missingInView ? '#B45309' : '#64748b', fontWeight: 700 }}>
          {missingInView ? `${missingInView} missing (in view)` : 'All visible CPIs filled'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 34%) 1fr' },
          gap: 0,
          border: '1px solid rgba(10,22,40,0.08)',
          borderRadius: 1,
          overflow: 'hidden',
          minHeight: 320,
        }}
      >
        {/* Left */}
        <Box sx={{ p: 2, borderRight: { md: '1px solid rgba(10,22,40,0.08)' }, borderBottom: { xs: '1px solid rgba(10,22,40,0.08)', md: 'none' }, bgcolor: '#fff' }}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder="Course or programme…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 1.25 }}
          />

          <TextField
            fullWidth
            select
            size="small"
            label="Programme"
            value={programmeFilter}
            onChange={(e) => setProgrammeFilter(e.target.value)}
            sx={{ mb: 1.25 }}
          >
            <MenuItem value="">All programmes</MenuItem>
            {programmeTitles.map((t) => (
              <MenuItem key={t} value={t}>
                {t.length > 72 ? `${t.slice(0, 72)}…` : t}
              </MenuItem>
            ))}
          </TextField>

          <List dense sx={{ maxHeight: 360, overflowY: 'auto', border: '1px solid rgba(10,22,40,0.08)', borderRadius: 1 }}>
            {filteredRows.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '12.5px', color: '#94A3B8', fontStyle: 'italic' }}>No matches.</Typography>
              </Box>
            ) : (
              filteredRows.map((r) => (
                <ListItemButton
                  key={r.courseId}
                  selected={r.courseId === activeCourseId}
                  onClick={() => setActiveCourseId(r.courseId)}
                  sx={{
                    alignItems: 'flex-start',
                    py: 1,
                    '&.Mui-selected': { bgcolor: 'rgba(200,146,42,0.10)' },
                  }}
                >
                  <Box sx={{ width: 8, mt: '6px', mr: 1, flexShrink: 0 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.missing ? '#F59E0B' : '#10B981' }} />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '12.5px', fontWeight: 800, color: '#0A1628', lineHeight: 1.25 }}>
                        {r.courseName}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.35, whiteSpace: 'normal' }}>
                        {r.programmeTitle}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </Box>

        {/* Right */}
        <Box sx={{ p: 2, bgcolor: 'rgba(244,246,249,0.35)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{posLabel}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => goPrevNext(-1)} disabled={filteredRows.length === 0}>
                Prev
              </Button>
              <Button size="small" variant="outlined" onClick={() => goPrevNext(1)} disabled={filteredRows.length === 0}>
                Next
              </Button>
            </Box>
          </Box>

          {activeRow ? (
            <Box>
              <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#0A1628', lineHeight: 1.15 }}>
                {activeRow.courseName}
              </Typography>
              <Typography sx={{ fontSize: '12.5px', color: '#64748b', mt: 0.75, mb: 2 }}>{activeRow.programmeTitle}</Typography>

              <TextField
                fullWidth
                size="small"
                type="number"
                label="Minimum CPI"
                inputProps={{ step: '0.1', min: 0, max: 10 }}
                placeholder="e.g. 7.5"
                value={activeRow.cpiStr}
                onChange={(e) => setCpiForCourse(activeRow.courseId, e.target.value)}
                autoFocus
                sx={{
                  maxWidth: 280,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderLeft: '3px solid #C8922A',
                    '& fieldset': { borderColor: 'rgba(200,146,42,0.25)' },
                    '&:hover fieldset': { borderColor: '#C8922A' },
                    '&.Mui-focused fieldset': { borderColor: '#0A1628' },
                  },
                }}
              />

              <Typography sx={{ fontSize: '12px', color: '#94A3B8', mt: 1.5, maxWidth: 520, lineHeight: 1.45 }}>
                Clear the field to remove a course-specific CPI (you will need a value again before saving).
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '12.5px', color: '#94A3B8', fontStyle: 'italic' }}>Nothing to edit.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
