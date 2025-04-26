import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { IndianRupee } from "lucide-react";

const SignUp = ({ cur, setCur }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(email, password, name);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        emailId: email,
        password,
        name,
      },{
          withCredentials: true
        });

      console.log('Signup successful:', response);
      localStorage.setItem('name', response.data.email);
      localStorage.setItem('id', response.data._id);
      localStorage.setItem('email', response.data.emailId);
      setCur('login');
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to sign up. Enter the correct details. </br>Maybe the account already exists');
      console.error('Signup error:', err);
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
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md my-8">
        <div className="text-center">
          <IndianRupee className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to start tracking your expenses
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2" dangerouslySetInnerHTML={{ __html: error }}></p>} 

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}  
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => setCur("login")} className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default SignUp;