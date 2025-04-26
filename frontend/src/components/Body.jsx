import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Login from './Login';
import SignUp from './SIgnUp';



const Body = () => {
  const [cur, setCur] = useState("login");
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && profile) {
      navigate('/dashboard');
    }
  }, [profile, loading, navigate]);
   if (loading) {
    return <div>Loading...</div>;
  }
  if (profile) {
    return <Outlet />;
  }

  return (
    <>
      {cur === "login" ? <Login cur={cur} setCur={setCur} /> : <SignUp cur={cur} setCur={setCur} />}
    </>
  );
};

export default Body;

