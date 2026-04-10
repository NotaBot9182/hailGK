'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authApi.forgotPassword(email);
      setSuccess('If an account exists with that email, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Strip */}
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

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Panel — Navy with pattern */}
        <Box
          sx={{
            width: '50%',
            bgcolor: '#0A1628',
            position: 'relative',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 6,
            overflow: 'hidden',
          }}
        >
          {/* Grid pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(200,146,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />
          {/* Teal accent */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(27,94,107,0.3) 0%, rgba(27,94,107,0.1) 40%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Gold bottom line */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: '#C8922A',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '440px' }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                bgcolor: 'rgba(200,146,42,0.15)',
                border: '1px solid rgba(200,146,42,0.35)',
                color: '#E8B64A',
                px: '14px',
                py: '5px',
                borderRadius: '2px',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 500,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: '#E8B64A',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                  },
                }}
              />
              Recruiter Portal
            </Box>

            <Typography
              sx={{
                fontFamily: '"EB Garamond", serif',
                fontSize: '48px',
                fontWeight: 500,
                color: '#FEFEFE',
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: '-0.01em',
              }}
            >
              Career<br />Development<br />
              <em style={{ color: '#E8B64A' }}>Centre</em>
            </Typography>

            <Typography
              sx={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '380px',
                mb: 4,
              }}
            >
              Submit Job Notification Forms (JNF) and Intern Notification Forms (INF) for India&apos;s premier institute of technology. 
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 4 }}>
              {[
                { value: '500+', label: 'Companies' },
                { value: '1200+', label: 'Offers Given' },
                { value: '250+', label: 'Job Profiles' },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    sx={{
                      fontFamily: '"EB Garamond", serif',
                      fontSize: '28px',
                      fontWeight: 500,
                      color: '#FEFEFE',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', mt: '4px' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Panel — Forgot Password Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FEFEFE',
            position: 'relative',
            px: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {/* Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: 5 }}>
              <Box
                component="img"
                src="/iit-ism-logo.svg"
                alt="IIT (ISM) Dhanbad"
                sx={{
                  width: 44,
                  height: 44,
                  objectFit: 'contain',
                  flexShrink: 0,
                  filter: 'brightness(0) invert(1)',
                }}
              />
              <Box>
                <Typography sx={{ fontFamily: '"EB Garamond", serif', fontSize: '16px', fontWeight: 600, color: '#0A1628', lineHeight: 1.2 }}>
                  IIT (ISM) Dhanbad
                </Typography>
                <Typography sx={{ fontSize: '10.5px', color: '#5A6478', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Career Development Centre
                </Typography>
              </Box>
            </Box>

            {/* Form Title */}
            <Typography
              sx={{
                fontFamily: '"EB Garamond", serif',
                fontSize: '32px',
                fontWeight: 500,
                color: '#0A1628',
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Forgot Password
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#5A6478', mb: 4, lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(139,26,26,0.08)',
                  color: '#8B1A1A',
                  borderRadius: '4px',
                  border: '1px solid rgba(139,26,26,0.15)',
                  '& .MuiAlert-icon': { color: '#8B1A1A' },
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(27,94,107,0.08)',
                  color: '#1B5E6B',
                  borderRadius: '4px',
                  border: '1px solid rgba(27,94,107,0.15)',
                  '& .MuiAlert-icon': { color: '#1B5E6B' },
                }}
              >
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '12px', color: '#5A6478', fontWeight: 500, mb: '6px' }}>
                  Email Address <Box component="span" sx={{ color: '#8B1A1A' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="recruiter@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="small"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#0A1628',
                  color: '#FEFEFE',
                  py: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '4px',
                  '&:hover': { bgcolor: '#2C3345' },
                  '&:disabled': { opacity: 0.7 },
                  mb: 3
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: '#FEFEFE' }} />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link href="/login" style={{ fontSize: '13px', color: '#1B5E6B', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Login
              </Link>
            </Box>

            {/* Quick links */}
            <Box
              sx={{
                mt: 5,
                pt: 3,
                borderTop: '1px solid rgba(10,22,40,0.08)',
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              {[
                { name: 'Home', path: '/' },
                { name: 'Brochure', path: '/brochure.html' },
                { name: 'Contact CDC', path: '/' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  style={{
                    fontSize: '12px',
                    color: '#5A6478',
                    textDecoration: 'none',
                  }}
                >
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