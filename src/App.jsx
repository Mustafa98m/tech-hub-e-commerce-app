import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Products from './components/Products';
import Users from './components/Users';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ProductDetails from './components/ProductDetails';



const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7f10c0ff',
        contrastText: '#000000',
      },
      secondary: {
        main: darkMode ? '#7f10c0ff' : '#f2e6fcff',
      },
      background: {
        default: darkMode ? '#211e1eff' : '#f7f2ffff',
        paper: darkMode ? '#211e1eff' : '#f7f2ffff',
      },
    },
    components: {
        MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#7f10c0ff' , // اللون عند التركيز Focus
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        '&.Mui-focused': {
          color: '#7f10c0ff' , // لون عنوان الحقل عند التركيز
        },
      },
    },
  },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: '#7f10c0ff',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#7f10c0ff',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#8910cfff': '#8910cfff',
            color: darkMode ? '#101010ff' : '#000000',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <ProtectedRoute>
            <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />





            <Route path="/users" element={<Users />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<Navigate to="/products" replace />} />
            </Routes>

          </ProtectedRoute>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
