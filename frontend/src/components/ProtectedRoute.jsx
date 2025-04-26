import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = () => {
  const { profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  return profile ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
