import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile/view`, {
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err) {
      setProfile(null);
      console.error('Auth fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  console.log(import.meta.env.VITE_API_URL);
  const signOut = async () => {
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {
        withCredentials: true,
      });
      setProfile(null);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
