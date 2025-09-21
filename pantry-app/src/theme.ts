import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) => createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode,
    primary: {
      main: '#005A9C', // Classic Blue (Secondary/Headers/Main Elements)
      light: '#3574B4',
      dark: '#004080',
    },
    secondary: {
      main: '#007BFF', // Bright Blue (Accent/Buttons/CTAs/Links)
      light: '#40A3FF',
      dark: '#0056CC',
    },
    background: {
      default: mode === 'light' ? '#F4F6F8' : '#121212', // Light Cool Gray or Dark
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E', // White for cards and elevated surfaces or Dark Paper
    },
    text: {
      primary: mode === 'light' ? '#2E3641' : '#FFFFFF', // Dark Slate or White
      secondary: mode === 'light' ? '#5A6C7D' : '#B0BEC5', // Darker version for secondary text or Light Gray
    },
    grey: {
      50: mode === 'light' ? '#F4F6F8' : '#FAFAFA',
      100: mode === 'light' ? '#E8ECEF' : '#F5F5F5',
      200: mode === 'light' ? '#D6DBDF' : '#EEEEEE', // Soft Gray (Neutral/Borders/Cards)
      300: mode === 'light' ? '#C4CAD0' : '#E0E0E0',
      400: mode === 'light' ? '#B2B9C1' : '#BDBDBD',
      500: mode === 'light' ? '#9FA8B2' : '#9E9E9E',
      600: mode === 'light' ? '#8D97A3' : '#757575',
      700: mode === 'light' ? '#7A8694' : '#616161',
      800: mode === 'light' ? '#5A6C7D' : '#424242',
      900: mode === 'light' ? '#2E3641' : '#212121', // Dark Slate
    },
    success: {
      main: '#28A745', // Green for success states
      light: '#6CBB69',
      dark: '#1E7E34',
    },
    warning: {
      main: '#FFC107', // Amber for warning states
      light: '#FFD54F',
      dark: '#FF8F00',
    },
    error: {
      main: '#DC3545', // Red for error states
      light: '#F1948A',
      dark: '#C82333',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: '100%',
          height: '100%',
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
          '@media (max-width:600px)': {
            paddingLeft: '8px !important',
            paddingRight: '8px !important',
          },
        },
        maxWidthXs: {
          maxWidth: '100% !important',
        },
        maxWidthSm: {
          maxWidth: '100% !important',
        },
        maxWidthMd: {
          maxWidth: '100% !important',
        },
        maxWidthLg: {
          maxWidth: '100% !important',
        },
        maxWidthXl: {
          maxWidth: '100% !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            padding: '10px 20px',
            fontSize: '0.875rem',
          },
          '&:hover': {
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0D47A1 0%, #0277BD 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            borderRadius: 16,
          },
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '16px',
            '&:last-child': {
              paddingBottom: '16px',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1565C0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1565C0',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '@media (max-width:600px)': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            '& .MuiToolbar-root': {
              paddingLeft: '8px',
              paddingRight: '8px',
              minHeight: '56px',
            },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            flexWrap: 'wrap',
            gap: '8px',
          },
        },
      },
    },
  },
});

// Default light theme for backwards compatibility
const defaultTheme = getTheme('light');

export default defaultTheme;