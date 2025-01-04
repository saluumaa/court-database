import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);


  const handleLogout = () => {
    logout();
  };

  return (
    <div className='flex flex-col items-end justify-end ml-auto text-2xl gap-5'>
      {currentUser ? (
        <>
          <p className='text-yellow-500 font-bold '>Welcome, {currentUser.username}!</p>
          <button className='italic rounded-lg  lg:py-2 border-x-2 border-green-400' onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p className='text-yellow-500 font-bold italic'>Please log in.</p>
         <Link to='/login'> <button className='text-green-500 font-bold border-x-2 border-yellow-300 rounded-lg lg:py-2'>Login</button> </Link> 
        </>
      )}
    </div>
  );
};

export default Dashboard;
