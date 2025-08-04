import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await axios.get('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL' });
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL' });
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 