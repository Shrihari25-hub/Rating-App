import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || 'null')
      setUser(userData)
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
  try {
    console.log('🔄 AuthContext: Attempting login with:', { email });
    
    const response = await authAPI.login(email, password);
    console.log('✅ AuthContext: Raw response:', response);
    console.log('📋 AuthContext: Response data:', response.data);
    
    if (!response.data) {
      throw new Error('No data in response');
    }
  
    let token, userData;
    
    if (response.data.token && response.data.user) {
   
      token = response.data.token;
      userData = response.data.user;
    } else if (response.data.accessToken) {
      token = response.data.accessToken;
      userData = response.data.user || response.data;
    } else {
      token = response.data.token || response.data.id;
      userData = response.data;
    }

    if (!userData || !userData.id || !userData.email) {
      console.error('❌ Invalid user data structure:', userData);
      throw new Error('Invalid user data received from server');
    }
    
    const userWithRole = {
      ...userData,
      role: userData.role || 'user'
    };
    
    setToken(token);
    setUser(userWithRole);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    
    console.log('✅ AuthContext: Login completed successfully');
    return { 
      success: true, 
      user: userWithRole 
    };
    
  } catch (error) {
    console.error('❌ AuthContext: Login error:', error);
    
    let errorMessage = 'Login failed';
    
    if (error.response) {
      console.error('📊 Server response data:', error.response.data);
      console.error('📊 Server response status:', error.response.status);
      errorMessage = error.response.data.error || 
                     error.response.data.message || 
                     `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error('🌐 Network error - request made but no response:', error.request);
      errorMessage = 'Cannot connect to server. Please check if backend is running.';
    } else {
      console.error('⚡ Other error:', error.message);
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  const register = async (userData) => {
  try {
    console.log('🔄 Frontend: Attempting registration with:', userData);
    
    const response = await authAPI.register(userData);
    console.log('✅ Frontend: Registration response:', response.data);
    
    const { token: newToken, user: userResponse } = response.data;
    
    setToken(newToken);
    setUser(userResponse);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userResponse));
    
    console.log('✅ Frontend: Registration completed successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Frontend: Registration error:', error);
    
    let errorMessage = 'Registration failed';
    
    if (error.response) {
      console.error('📊 Server response:', error.response.data);
      errorMessage = error.response.data.error || 
                     error.response.data.details || 
                     `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      errorMessage = 'Cannot connect to server. Please check if backend is running.';
    } else {
      console.error('⚡ Other error:', error.message);
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

 const changePassword = async (currentPassword, newPassword) => {
  try {
    console.log('🔄 Attempting password change');
    
    const response = await authAPI.changePassword(currentPassword, newPassword);
    
    console.log('✅ Password changed successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Password change error:', error);
    
    let errorMessage = 'Password change failed';
    
    if (error.response) {
      console.error('📊 Server response:', error.response.data);
      errorMessage = error.response.data.error || 
                     error.response.data.details || 
                     `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      errorMessage = 'Cannot connect to server. Please check if backend is running.';
    } else {
      console.error('⚡ Other error:', error.message);
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}