'use client';

import { createTheme } from '@mui/material/styles';

// ISM Aesthetic Design System — matching cdc-portal.html
const theme = createTheme({
  palette: {
    primary: {
      main: '#0A1628',       // ism-navy
      light: '#132040',      // ism-navy-mid
      dark: '#060E1A',
      contrastText: '#FEFEFE',
    },
    secondary: {
      main: '#C8922A',       // ism-gold
      light: '#E8B64A',      // ism-gold-light
      dark: '#9A7020',
      contrastText: '#0A1628',
    },
    background: {
      default: '#F4F6F9',    // ism-grey-pale
      paper: '#FEFEFE',      // ism-white
    },
    text: {
      primary: '#0A1628',    // ism-navy
      secondary: '#5A6478',  // ism-grey-mid
    },
    error: {
      main: '#8B1A1A',       // ism-red
    },
    success: {
      main: '#1d6b3a',
    },
    warning: {
      main: '#8B6000',
    },
    info: {
      main: '#1B5E6B',       // ism-teal
      light: '#2A8A9E',      // ism-teal-light
    },
    divider: 'rgba(10,22,40,0.12)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"EB Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"EB Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: '2.25rem',
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: '"EB Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"EB Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"EB Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#5A6478',
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: '#2A8A9E',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.65,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
      fontSize: '0.84375rem',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.6875rem',
      letterSpacing: '0.04em',
      fontWeight: 500,
      color: '#5A6478',
    },
    overline: {
      fontSize: '0.6875rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 20px',
          transition: 'all 0.15s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0A1628',
          color: '#FEFEFE',
          '&:hover': {
            backgroundColor: '#2C3345',
          },
        },
        containedSecondary: {
          backgroundColor: '#C8922A',
          color: '#FEFEFE',
          '&:hover': {
            backgroundColor: '#E8B64A',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(10,22,40,0.2)',
          color: '#0A1628',
          '&:hover': {
            backgroundColor: '#F4F6F9',
            borderColor: 'rgba(10,22,40,0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            fontSize: '0.84375rem',
            fontFamily: '"DM Sans", sans-serif',
            '& fieldset': {
              borderColor: 'rgba(10,22,40,0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(10,22,40,0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A1628',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.8125rem',
            color: '#5A6478',
            fontWeight: 500,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(10,22,40,0.12)',
          boxShadow: '0 2px 8px rgba(10,22,40,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(10,22,40,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(10,22,40,0.12)',
        },
        elevation3: {
          boxShadow: '0 8px 40px rgba(10,22,40,0.16)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 500,
          height: 28,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(10,22,40,0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(10,22,40,0.12)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 500,
          fontSize: '0.6875rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
          color: '#5A6478',
          borderBottomColor: 'rgba(10,22,40,0.12)',
        },
        body: {
          fontSize: '0.8125rem',
          borderBottomColor: 'rgba(10,22,40,0.12)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F4F6F9',
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepIcon-root': {
            color: 'rgba(10,22,40,0.12)',
            '&.Mui-active': {
              color: '#0A1628',
            },
            '&.Mui-completed': {
              color: '#C8922A',
            },
          },
          '& .MuiStepLabel-label': {
            fontSize: '0.8125rem',
            fontWeight: 400,
            '&.Mui-active': {
              fontWeight: 500,
              color: '#0A1628',
            },
            '&.Mui-completed': {
              color: '#5A6478',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '0.84375rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: '1px solid rgba(10,22,40,0.12)',
        },
      },
    },
  },
});

export default theme;
