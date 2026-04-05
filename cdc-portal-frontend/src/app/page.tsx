'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const stats = [
  { value: '98', suffix: '', label: 'Years of academic excellence' },
  { value: '500', suffix: '+', label: 'Recruiting companies' },
  { value: '₹48', suffix: 'L', label: 'Highest CTC (2024–25)' },
  { value: '32', suffix: '+', label: 'Academic departments' },
  { value: '12', suffix: '', label: 'B.Tech / Dual Degree branches' },
];

const usps = [
  { num: '01 / Heritage', title: 'Established in 1926 — India\'s oldest technical institute', desc: 'Nearly a century of academic rigour and industry partnerships. IIT (ISM) has shaped India\'s mining, steel, and energy sectors for generations.' },
  { num: '02 / Programmes', title: 'Unique specialisations unavailable elsewhere', desc: 'India\'s only institute offering Petroleum Engineering, Mining Machinery, Applied Geophysics, and Earthquake Science at undergraduate and postgraduate levels.' },
  { num: '03 / Diversity', title: '32+ programmes across engineering, science, and management', desc: 'Recruit from B.Tech, M.Tech, M.Sc, MBA (Business Analytics, Finance, Marketing), and Ph.D programmes — all under one roof.' },
  { num: '04 / Rigour', title: 'JEE Advanced, GATE, JAM, and CAT selectivity', desc: 'Every student has cleared a highly competitive national entrance examination, ensuring demonstrated academic merit and problem-solving ability.' },
  { num: '05 / Industry Linkage', title: 'Deep ties with PSUs, MNCs, and startups alike', desc: 'ONGC, Coal India, Tata Steel, Infosys, Goldman Sachs, and 500+ companies have a longstanding relationship with our placement office.' },
  { num: '06 / Compliance', title: 'NIRF, RTI, and AIPC compliant recruitment process', desc: 'Structured, transparent, and fully documented placement process aligned with national guidelines and regulatory requirements.' },
];

const processSteps = [
  { num: '01', label: 'Register Company', sub: 'Email OTP + company profile', active: true },
  { num: '02', label: 'Select Portal', sub: 'JNF (full-time) or INF (internship)', active: false },
  { num: '03', label: 'Fill Form', sub: 'Role, eligibility, salary, process', active: false },
  { num: '04', label: 'Preview & Submit', sub: 'Declare, sign, and submit', active: false },
  { num: '05', label: 'CDC Reviews', sub: 'Approval + email confirmation', active: false },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* ─── TOP STRIP ─── */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.7)', fontSize: '12px', px: '2rem', py: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.02em', fontFamily: '"DM Sans", sans-serif' }}>
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          {['NIRF Ranking', 'Institute Website', 'Contact CDC'].map((link) => (
            <Box key={link} component="a" href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px', '&:hover': { color: '#E8B64A' } }}>{link}</Box>
          ))}
        </Box>
      </Box>

      {/* ─── NOTICE BAR ─── */}
      <Box sx={{ bgcolor: '#F5E6C8', borderTop: '2px solid #C8922A', borderBottom: '1px solid rgba(200,146,42,0.3)', px: '2rem', py: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', color: '#0A1628' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="#C8922A"/><rect x="6.3" y="3" width="1.4" height="1.4" rx=".7" fill="#C8922A"/><rect x="6.3" y="5.5" width="1.4" height="5" rx=".7" fill="#C8922A"/></svg>
        <span><strong>Placement Season 2025–26 is now open.</strong> &nbsp;JNF submissions are accepted until 30 November 2025.</span>
        <Box component="a" href="#" sx={{ color: '#1B5E6B', fontWeight: 500, ml: '6px', textDecoration: 'none' }}>View Schedule →</Box>
      </Box>

      {/* ─── NAVBAR ─── */}
      <Box sx={{ bgcolor: '#FEFEFE', borderBottom: '1px solid rgba(10,22,40,0.12)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(10,22,40,0.08)' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', height: '68px' }}>
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <Box component="img" src="/iit-ism-logo.svg" alt="IIT (ISM) Dhanbad" sx={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '17px', fontWeight: 600, color: '#0A1628', lineHeight: 1.2 }}>IIT (ISM) Dhanbad</Typography>
              <Typography sx={{ fontSize: '11px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Career Development Centre</Typography>
            </Box>
          </Box>
          <Box sx={{ width: '1px', height: 32, bgcolor: '#E8EBF0', ml: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '4px', flex: 1 }}>
            {['Home', 'Why IIT (ISM)', 'Programmes', 'Past Recruiters', 'Brochure', 'Contact'].map((link) => (
              <Box key={link} component="a" href="#" sx={{ px: '14px', py: '6px', fontSize: '13.5px', color: '#5A6478', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.15s', '&:hover': { bgcolor: '#F4F6F9', color: '#0A1628' } }}>{link}</Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 'auto' }}>
            <Button component={Link} href="/login" sx={{ fontSize: '13.5px', color: '#0A1628', border: '1px solid rgba(10,22,40,0.2)', borderRadius: '4px', px: '20px', py: '6px', '&:hover': { bgcolor: '#F4F6F9' } }}>Recruiter Login</Button>
            <Button component={Link} href="/register" sx={{ fontSize: '13.5px', bgcolor: '#0A1628', color: '#FEFEFE', borderRadius: '4px', px: '20px', py: '6px', '&:hover': { bgcolor: '#2C3345' } }}>Register Company</Button>
          </Box>
        </Box>
      </Box>

      {/* ─── HERO ─── */}
      <Box sx={{ bgcolor: '#0A1628', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(200,146,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(135deg, rgba(27,94,107,0.25) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#C8922A' }} />
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', py: { xs: '60px', md: '80px' }, pb: { xs: '80px', md: '100px' }, position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 400px' }, gap: '4rem', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', bgcolor: 'rgba(200,146,42,0.15)', border: '1px solid rgba(200,146,42,0.35)', color: '#E8B64A', px: '14px', py: '5px', borderRadius: '2px', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, mb: 3 }}>
              <Box sx={{ width: 6, height: 6, bgcolor: '#E8B64A', borderRadius: '50%', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              Recruitment Portal · v1.0
            </Box>
            <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: { xs: '36px', md: '54px' }, fontWeight: 500, color: '#FEFEFE', lineHeight: 1.1, mb: 2.5, letterSpacing: '-0.01em' }}>
              Recruit <em style={{ color: '#E8B64A' }}>exceptional</em><br />talent from IIT ISM
            </Typography>
            <Typography sx={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', maxWidth: 520, lineHeight: 1.7, mb: 4.5 }}>
              Submit Job Notification Forms (JNF) and Intern Notification Forms (INF) for India&apos;s premier institute of technology, mining, and applied sciences — established 1926.
            </Typography>
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button component={Link} href="/register" sx={{ bgcolor: '#C8922A', color: '#0A1628', fontWeight: 600, px: '28px', py: '12px', fontSize: '14.5px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '8px', '&:hover': { bgcolor: '#E8B64A' } }}>
                Register as Recruiter
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>
              <Button sx={{ bgcolor: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.25)', px: '28px', py: '12px', fontSize: '14.5px', borderRadius: '4px', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.06)' } }}>
                Download Brochure
              </Button>
            </Box>
          </Box>

          {/* Stats Card */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '8px', p: 3.5, display: { xs: 'none', md: 'block' } }}>
            <Typography sx={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8B64A', mb: 2.5, fontWeight: 500 }}>Placement at a Glance · 2024–25</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#FEFEFE', lineHeight: 1 }}>500<Box component="span" sx={{ color: '#E8B64A', fontSize: '24px' }}>+</Box></Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', mt: '4px' }}>Companies visit annually</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#FEFEFE', lineHeight: 1 }}>₹48<Box component="span" sx={{ color: '#E8B64A', fontSize: '24px' }}>L</Box></Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', mt: '4px' }}>Highest CTC offered</Typography>
              </Box>
              <Box sx={{ gridColumn: '1 / -1', height: '1px', bgcolor: 'rgba(200,146,42,0.15)' }} />
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#FEFEFE', lineHeight: 1 }}>92<Box component="span" sx={{ color: '#E8B64A', fontSize: '24px' }}>%</Box></Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', mt: '4px' }}>Placement rate (UG)</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#FEFEFE', lineHeight: 1 }}>32<Box component="span" sx={{ color: '#E8B64A', fontSize: '24px' }}>+</Box></Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', mt: '4px' }}>Departments & programmes</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(200,146,42,0.15)', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Placement Brochure 2025', 'AIPC Guidelines', 'Past Recruiters List'].map((link) => (
                <Box key={link} component="a" href="#" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '12px', py: '8px', borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13px', transition: 'all 0.15s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#E8B64A' } }}>
                  <span>{link}</span>
                  <span style={{ fontSize: '12px', opacity: 0.5 }}>↗</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── STATS BAR ─── */}
      <Box sx={{ bgcolor: '#C8922A', py: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          {stats.map((stat, i) => (
            <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {i > 0 && <Box sx={{ width: '1px', height: 32, bgcolor: 'rgba(10,22,40,0.15)', display: { xs: 'none', md: 'block' } }} />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', ml: i > 0 ? 2 : 0 }}>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '28px', fontWeight: 600, color: '#0A1628', lineHeight: 1 }}>{stat.value}{stat.suffix}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(10,22,40,0.65)', maxWidth: 100, lineHeight: 1.3 }}>{stat.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ─── WHY RECRUIT ─── */}
      <Box sx={{ py: 9 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 1.5 }}>
            <Typography sx={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2A8A9E', fontWeight: 500 }}>Why IIT (ISM) Dhanbad</Typography>
            <Box sx={{ position: 'absolute', bottom: '-4px', left: 0, width: 48, height: 2, bgcolor: '#C8922A' }} />
          </Box>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#0A1628', lineHeight: 1.15, mb: 1.5 }}>A legacy of engineering excellence</Typography>
          <Typography sx={{ fontSize: '15px', color: '#5A6478', maxWidth: 560, lineHeight: 1.7 }}>Home to India&apos;s most specialised talent in mining, petroleum, earth sciences, and applied engineering — alongside world-class programmes in CSE, ECE, and management.</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5, mt: 5 }}>
            {usps.map((usp) => (
              <Box key={usp.num} sx={{ bgcolor: '#FEFEFE', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', p: 3.5, position: 'relative', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(10,22,40,0.12)' }, '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '3px', height: '40px', bgcolor: '#C8922A', borderRadius: '0 0 2px 0' } }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#5A6478', letterSpacing: '0.05em', mb: 1.5 }}>{usp.num}</Typography>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '20px', fontWeight: 500, color: '#0A1628', mb: 1.25, lineHeight: 1.25 }}>{usp.title}</Typography>
                <Typography sx={{ fontSize: '13.5px', color: '#5A6478', lineHeight: 1.65 }}>{usp.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── PORTAL CARDS ─── */}
      <Box sx={{ py: 9, bgcolor: '#F4F6F9', borderTop: '1px solid rgba(10,22,40,0.12)', borderBottom: '1px solid rgba(10,22,40,0.12)' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 1.5 }}>
            <Typography sx={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2A8A9E', fontWeight: 500 }}>Submit Your Requirements</Typography>
            <Box sx={{ position: 'absolute', bottom: '-4px', left: 0, width: 48, height: 2, bgcolor: '#C8922A' }} />
          </Box>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#0A1628', lineHeight: 1.15, mb: 1.5 }}>Choose the right portal for your need</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 5 }}>
            {/* JNF Card */}
            <Box component={Link} href="/register" sx={{ bgcolor: '#FEFEFE', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', p: 4.5, position: 'relative', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all 0.2s', '&:hover': { boxShadow: '0 8px 40px rgba(10,22,40,0.16)', transform: 'translateY(-2px)' } }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', bgcolor: '#0A1628' }} />
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 500, bgcolor: 'rgba(10,22,40,0.07)', color: '#0A1628', display: 'inline-flex', px: '10px', py: '4px', borderRadius: '2px', mb: 2 }}>JNF · Full-Time</Typography>
              <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '26px', fontWeight: 500, color: '#0A1628', mb: 1.5, lineHeight: 1.2 }}>Job Notification Form</Typography>
              <Typography sx={{ fontSize: '14px', color: '#5A6478', lineHeight: 1.6, mb: 3 }}>For campus placement roles with detailed compensation — CTC breakdown, ESOP, joining bonus, bond conditions, and currency selector.</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['Multi-step form', 'Auto-save drafts', 'CTC / Salary grid', 'ESOP + Bond fields'].map((f) => (
                  <Box key={f} sx={{ fontSize: '12px', px: '12px', py: '4px', bgcolor: '#F4F6F9', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '20px', color: '#5A6478' }}>{f}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Start JNF Submission
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Typography>
            </Box>

            {/* INF Card */}
            <Box component={Link} href="/register" sx={{ bgcolor: '#FEFEFE', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '8px', p: 4.5, position: 'relative', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all 0.2s', '&:hover': { boxShadow: '0 8px 40px rgba(10,22,40,0.16)', transform: 'translateY(-2px)' } }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', bgcolor: '#1B5E6B' }} />
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 500, bgcolor: 'rgba(27,94,107,0.1)', color: '#1B5E6B', display: 'inline-flex', px: '10px', py: '4px', borderRadius: '2px', mb: 2 }}>INF · Internship</Typography>
              <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '26px', fontWeight: 500, color: '#0A1628', mb: 1.5, lineHeight: 1.2 }}>Intern Notification Form</Typography>
              <Typography sx={{ fontSize: '14px', color: '#5A6478', lineHeight: 1.6, mb: 3 }}>For summer and winter internship programmes — simplified stipend structure, expected duration, and PPO provision toggle.</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['Multi-step form', 'Auto-save drafts', 'Stipend structure', 'PPO provision'].map((f) => (
                  <Box key={f} sx={{ fontSize: '12px', px: '12px', py: '4px', bgcolor: '#F4F6F9', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '20px', color: '#5A6478' }}>{f}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Start INF Submission
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── PROCESS ─── */}
      <Box sx={{ py: 9 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', px: '2rem', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2A8A9E', fontWeight: 500, mb: 1.5 }}>How it Works</Typography>
          <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '36px', fontWeight: 500, color: '#0A1628', lineHeight: 1.15, mb: 1.5 }}>Simple 5-step process</Typography>
          <Typography sx={{ fontSize: '15px', color: '#5A6478', lineHeight: 1.7, mx: 'auto' }}>From registration to approval — the entire flow is structured, trackable, and transparent.</Typography>
        </Box>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem', mt: 6 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 0, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 22, left: 'calc(10% + 16px)', right: 'calc(10% + 16px)', height: '1px', bgcolor: '#E8EBF0', display: { xs: 'none', md: 'block' } }} />
            {processSteps.map((step) => (
              <Box key={step.num} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, px: 1.5, textAlign: 'center' }}>
                <Box sx={{ width: 44, height: 44, bgcolor: step.active ? '#0A1628' : '#FEFEFE', border: '2px solid #0A1628', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 500, color: step.active ? '#FEFEFE' : '#0A1628', position: 'relative', zIndex: 1, flexShrink: 0 }}>{step.num}</Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#0A1628', lineHeight: 1.3 }}>{step.label}</Typography>
                <Typography sx={{ fontSize: '11.5px', color: '#5A6478', lineHeight: 1.4 }}>{step.sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── FOOTER ─── */}
      <Box sx={{ bgcolor: '#0A1628', color: 'rgba(255,255,255,0.6)', pt: 6, pb: 3 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: '2rem' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: '2.5rem', pb: 4.5, borderBottom: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
            <Box>
              <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '18px', fontWeight: 500, color: '#FEFEFE' }}>IIT (ISM) Dhanbad — CDC Recruitment Portal</Typography>
              <Typography sx={{ fontSize: '13px', lineHeight: 1.7, mt: 1.5, maxWidth: 300 }}>A structured, validated platform for companies to submit Job and Intern Notification Forms for campus recruitment.</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E8B64A', mb: 1.5 }}>Portals</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Job Notification Form (JNF)', 'Intern Notification Form (INF)', 'Recruiter Login', 'Register Company'].map((l) => (
                  <Box key={l} component="a" href="#" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.85)' } }}>{l}</Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E8B64A', mb: 1.5 }}>Resources</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Placement Brochure', 'Past Recruiters', 'AIPC Guidelines', 'NIRF Data'].map((l) => (
                  <Box key={l} component="a" href="#" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.85)' } }}>{l}</Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E8B64A', mb: 1.5 }}>Contact CDC</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box component="a" href="#" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>cdc@iitism.ac.in</Box>
                <Box component="a" href="#" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>+91-326-223-5xxx</Box>
                <Box component="a" href="#" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>CDC Building, IIT (ISM) Campus, Dhanbad — 826004</Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box sx={{ width: 20, height: 2, bgcolor: '#C8922A' }} />
              CDC Recruitment Portal v1.0 · IIT (ISM) Dhanbad · JNF + INF Portals
            </Box>
            <span>Next.js · MUI · Laravel · MySQL</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
