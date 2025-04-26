import React from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const {profile, signOut} = useAuth();
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut();
        navigate('/');
    }
  return (
    <div className='p-5 flex justify-between items-center'>
        <div className='text-xl mt-5'>
            Hi <span className="text-blue-500 text-xl font-medium">{profile.name}</span>
        </div>
        <button className='mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' onClick={handleSignOut}>LogOut</button>
    </div>
  )
}

export default Header