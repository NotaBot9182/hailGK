'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const LOGIN_STEPS = ['Credentials', 'Signing In'];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setActiveStep(1);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setActiveStep(0);
        throw new Error(data.message || 'Login failed');
      }

      setAuth(data.user, data.company, data.token);
      setLoginSuccess(true);

      setTimeout(() => {
        if (data.user.role === 'super_admin' || data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F6F9' }}>
      {/* ─── Top Strip ─── */}
      <Box
        sx={{
          bgcolor: '#0A1628',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          px: '2rem',
          py: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.02em',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <span>Indian Institute of Technology (ISM) Dhanbad — Est. 1926</span>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px' }}>
            Home
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/register" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px' }}>
            Register
          </Link>
        </Box>
      </Box>

      {/* ─── Main Content ─── */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* ─── Left Panel ─── */}
        <Box
          sx={{
            width: '50%',
            bgcolor: '#0A1628',
            position: 'relative',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 7,
            overflow: 'hidden',
          }}
        >
          {/* Grid pattern */}
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(200,146,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', bgcolor: '#C8922A' }} />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                bgcolor: 'rgba(200,146,42,0.15)', border: '1px solid rgba(200,146,42,0.35)',
                color: '#E8B64A', px: '14px', py: '5px', borderRadius: '2px',
                fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
                fontWeight: 500, mb: 4,
              }}
            >
              <Box sx={{ width: 6, height: 6, bgcolor: '#E8B64A', borderRadius: '50%', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              Recruiter Portal
            </Box>

            <Typography
              sx={{
                fontFamily: '"EB Garamond", serif',
                fontSize: '52px',
                fontWeight: 500,
                color: '#FEFEFE',
                lineHeight: 1.05,
                mb: 2.5,
              }}
            >
              Career<br />Development<br />
              <Box component="span" sx={{ fontStyle: 'italic', color: '#E8B64A' }}>Centre</Box>
            </Typography>

            <Typography
              sx={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '400px',
                mb: 5,
              }}
            >
              Submit Job Notification Forms (JNF) and Intern Notification Forms (INF) for India&apos;s premier institute of technology.
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              {[
                { value: '500+', label: 'Companies' },
                { value: '1200+', label: 'Offers' },
                { value: '250+', label: 'Profiles' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '28px', fontWeight: 500, color: '#FEFEFE', lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', mt: '4px' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ─── Right Panel — Login Form with Stepper ─── */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F4F6F9',
            position: 'relative',
            px: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
            {/* Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: 5 }}>
              <Box
                component="img"
                src="/iit-ism-logo.svg"
                alt="IIT (ISM) Dhanbad"
                sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
              />
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '18px', fontWeight: 500, color: '#0A1628', lineHeight: 1.2 }}>
                  IIT (ISM) Dhanbad
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Career Development Centre
                </Typography>
              </Box>
            </Box>

            {/* ─── Stepper ─── */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {LOGIN_STEPS.map((label, i) => {
                  const isActive = activeStep === i;
                  const isDone = i < activeStep || loginSuccess;
                  return (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', flex: i < LOGIN_STEPS.length - 1 ? 1 : 'none' }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 500,
                        fontFamily: '"JetBrains Mono", monospace',
                        transition: 'all 0.2s',
                        bgcolor: isDone ? '#C8922A' : isActive ? '#0A1628' : '#FEFEFE',
                        color: isDone || isActive ? '#FEFEFE' : '#5A6478',
                        border: `2px solid ${isDone ? '#C8922A' : isActive ? '#0A1628' : 'rgba(10,22,40,0.12)'}`,
                      }}>
                        {isDone ? '✓' : `0${i + 1}`}
                      </Box>
                      {i < LOGIN_STEPS.length - 1 && (
                        <Box sx={{ flex: 1, height: '1px', mx: 1.5, bgcolor: isDone ? '#C8922A' : 'rgba(10,22,40,0.12)' }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', mt: 1 }}>
                {LOGIN_STEPS.map((label, i) => (
                  <Box key={label} sx={{ flex: 1 }}>
                    <Typography sx={{
                      fontSize: '12px', fontWeight: activeStep === i ? 600 : 400,
                      color: activeStep === i ? '#0A1628' : '#5A6478',
                    }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ─── Form Card ─── */}
            <Box
              sx={{
                bgcolor: '#FEFEFE',
                borderRadius: '8px',
                border: '1px solid rgba(10,22,40,0.12)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
              }}
            >
              {/* Card Header */}
              <Box sx={{
                px: 3, py: 2,
                borderBottom: '1px solid rgba(10,22,40,0.12)',
                bgcolor: '#F4F6F9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '18px', fontWeight: 500, color: '#0A1628' }}>
                  {activeStep === 0 ? 'Recruiter Login' : loginSuccess ? 'Welcome Back!' : 'Authenticating...'}
                </Typography>
                <Typography sx={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
                  color: '#5A6478', bgcolor: '#E8EBF0', px: '8px', py: '3px', borderRadius: '4px',
                }}>
                  Step {activeStep + 1} of {LOGIN_STEPS.length}
                </Typography>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3 }}>
                {/* Step 0: Credentials */}
                {activeStep === 0 && (
                  <>
                    <Typography sx={{ fontSize: '13px', color: '#5A6478', mb: 3, lineHeight: 1.6 }}>
                      Sign in to access your recruitment dashboard and manage JNF/INF submissions.
                    </Typography>

                    {error && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3, borderRadius: '4px',
                          bgcolor: 'rgba(139,26,26,0.08)',
                          border: '1px solid rgba(139,26,26,0.15)',
                          color: '#8B1A1A',
                          '& .MuiAlert-icon': { color: '#8B1A1A' },
                        }}
                        onClose={() => setError('')}
                      >
                        {error}
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>
                          Email Address <Box component="span" sx={{ color: '#8B1A1A' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          type="email"
                          placeholder="recruiter@company.com"
                          value={formData.email}
                          onChange={handleChange('email')}
                          required
                          size="small"
                          id="login-email"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>
                          Password <Box component="span" sx={{ color: '#8B1A1A' }}>*</Box>
                        </Typography>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange('password')}
                          required
                          size="small"
                          id="login-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  sx={{ color: '#5A6478' }}
                                >
                                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Box sx={{ textAlign: 'right', mb: 3 }}>
                        <Link href="/forgot-password" style={{ fontSize: '13px', color: '#1B5E6B', textDecoration: 'none', fontWeight: 500 }}>
                          Forgot Password?
                        </Link>
                      </Box>

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        id="login-submit"
                        sx={{
                          bgcolor: '#0A1628',
                          color: '#FEFEFE',
                          py: '12px',
                          fontSize: '14px',
                          fontWeight: 500,
                          borderRadius: '4px',
                          '&:hover': { bgcolor: '#2C3345' },
                          '&:disabled': { opacity: 0.7 },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={22} sx={{ color: '#FEFEFE' }} />
                        ) : (
                          'Sign In →'
                        )}
                      </Button>
                    </form>
                  </>
                )}

                {/* Step 1: Signing In / Success */}
                {activeStep === 1 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    {loginSuccess ? (
                      <>
                        <Box sx={{
                          width: 64, height: 64, borderRadius: '50%',
                          bgcolor: 'rgba(29,107,58,0.1)',
                          border: '2px solid rgba(29,107,58,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                        }}>
                          <Typography sx={{ fontSize: '28px', color: '#1d6b3a' }}>✓</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '22px', fontWeight: 500, color: '#0A1628', mb: 1 }}>
                          Authentication Successful
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#5A6478' }}>
                          Redirecting to your dashboard...
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CircularProgress size={48} sx={{ color: '#1B5E6B', mb: 3 }} />
                        <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '20px', fontWeight: 500, color: '#0A1628', mb: 1 }}>
                          Verifying credentials...
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#5A6478' }}>
                          Please wait while we authenticate your account.
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Register link */}
            {activeStep === 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#5A6478' }}>
                  New recruiter?{' '}
                  <Link href="/register" style={{ color: '#1B5E6B', fontWeight: 500, textDecoration: 'none' }}>
                    Register your company →
                  </Link>
                </Typography>
              </Box>
            )}

            {/* Quick links */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(10,22,40,0.12)', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Brochure', path: '/brochure.html' },
                { name: 'Contact CDC', path: '/' }
              ].map((link) => (
                <Link key={link.name} href={link.path} style={{ fontSize: '12px', color: '#5A6478', textDecoration: 'none' }}>
                  {link.name}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
