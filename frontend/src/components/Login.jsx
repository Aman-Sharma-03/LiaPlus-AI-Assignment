import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { IndianRupee } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Login = ({ cur, setCur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { setProfile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(''); // Reset error

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        emailId: email,
        password: password
      }, {
        withCredentials: true
      });

      setProfile(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <IndianRupee className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to track your expenses</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => setCur("signup")} className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default Login;