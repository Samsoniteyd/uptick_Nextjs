import axios from 'axios';
import Cookies from 'js-cookie';

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const authApi = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


const addAuthInterceptor = (instance: typeof api) => {
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
};


const addResponseInterceptor = (instance: typeof api) => {
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ Response: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => {
      console.error('Axios interceptor - Response error:', error);
      
      
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.error('⏱️ Request timeout - backend might be slow or unresponsive');
        
        return Promise.reject(error);
      }
      
      
      if (!error.response) {
        console.error('🌐 Network error - backend might be down');
        
        return Promise.reject(error);
      }

    
      console.error(`❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error('Error data:', error.response.data);
      
      
      if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
        console.log('🔒 Unauthorized access to protected resource, removing token');
        Cookies.remove('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
    
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(api);
addAuthInterceptor(authApi);
addResponseInterceptor(api);
addResponseInterceptor(authApi);

export default api; 