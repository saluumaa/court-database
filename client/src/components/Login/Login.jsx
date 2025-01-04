import React, { useContext, useEffect, useState } from 'react'
import styles from './login.module.css'
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';

export const Login = () => {
    const {login} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const [changePassword, setChangePassword] = useState(false);


    const togglePasswordVisibility = (fieldId) => {
      const inputField = document.getElementById(fieldId);
      if (inputField) {
        inputField.type = inputField.type === "password" ? "text" : "password";
      }
    };

    

    const handleChangePassword = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setSuccess(null);
  
      const formData = new FormData(e.target);
      const data = {
          oldPassword: formData.get('oldPassword'),
          newPassword: formData.get('newPassword')
      };
  
      try {
          const response = await apiRequest.put('/auth/change-password', data); // Wait for the API response
          if (response.status === 200) {
              setSuccess("Password successfully changed");
              setTimeout(() => setSuccess(null), 3000);
              login(response.data);
              setChangePassword(false);
              navigate('/login');
          }
      } catch (err) {
          setError("Password change failed. Please try again.");
          setTimeout(() => setError(null), 3000); // Clear the error message after 3 seconds
      }finally{
         setIsLoading(false);
      }
  };
  

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

       const formData = new FormData(e.target);
         const data = {
            username: formData.get('username'),
            password: formData.get('password')
         }

         try{
            const response = await apiRequest.post('/auth/login', data);
            if(response.status === 200){
              setSuccess("Successfully logged in"); 
              setTimeout(() => setSuccess(null), 3000);
                login(response.data);
                navigate('/');
            }
         }catch(err){
            setError("Invalid username or password");
            setTimeout(() => setError(null), 3000);
         }finally{
            setIsLoading(false);
         }
          
    }

  return (
    <div className={`${styles.loginContainer1} w-full h-screen mx-auto flex flex-col backdrop-blur-md  `}>
        <h1 className="text-4xl text-center font-bold italic text-green-500 mb-12">
          {changePassword? 'Change Password': 'Login'}
        </h1>
       <div className="flex flex-col justify-start flex-wrap h-96 mx-4 lg:mx-40 rounded-lg text-black ">
        { !changePassword?
          (<form onSubmit={handleLogin}
          className="flex flex-col flex-wrap gap-4 p-4  text-lg bg-opacity-60 md:w-1/2 md:mx-auto rounded-lg ml-10 mr-10">
            <div className="flex flex-wrap gap-4 justify-between">
              <label htmlFor="User Name" className="text-black">User</label>
              <input type="text" name="username" id="username" placeholder="UserName" className="text-green-500 placeholder:text-green-500 placeholder:italic rounded-md bg-transparent outline-none border-0 border-b-2 p-0 focus:p-2 " />
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <label htmlFor="password" className="text-black">Password</label>
             
              <div
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="relative text-black bg-transparent border-none focus:outline-none"
              >
                 <input type="password" name="password" id="password" placeholder="Password" className=" text-black placeholder:text-green-500 placeholder:italic rounded-md bg-transparent outline-none border-0 border-b-2 p-0 focus:p-2 " />
                <span
                className='absolute right-0 top-0 text-lg cursor-pointer'
                >👁️</span>
              </div>
            </div>
            <button type="submit" className="p-2 text-xl mr-auto bg-transparent text-black rounded-md font-bold"
            disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
            </button>
            {success && <p className="text-yellow-500">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>):
          <p className="text-black text-xl font-bold ml-auto mr-4">
                <button
                onClick={() => setChangePassword(false)}
                
                >Login Now!</button>
          </p>
        }
        {changePassword? 
         <form onSubmit={handleChangePassword}
         className="flex flex-col gap-2 p-4  text-lg bg-opacity-60 lg:w-1/2 md:mx-auto rounded-lg ml-10 mr-10">
          <div className="flex gap-12 justify-between">
            <label htmlFor="Old Password" className="text-black">Old Password</label>
            <div
                type="button"
                onClick={() => togglePasswordVisibility('oldPassword')}
                className="relative text-black bg-transparent border-none focus:outline-none"
              >
                 <input type="password" name="oldPassword" id="oldPassword" placeholder="oldPassword" className=" text-black placeholder:text-green-500 placeholder:italic rounded-md bg-transparent outline-none border-0 border-b-2 p-0 focus:p-2 " />
                <span
                className='absolute right-0 top-0 text-lg cursor-pointer'
                >👁️</span>
              </div>
           </div>

           <div className="flex gap-4 justify-between">
            <label htmlFor="New Password" className="text-black">New Password</label>
            <div
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="relative text-black bg-transparent border-none focus:outline-none"
              >
                 <input type="password" name="newPassword" id="newPassword" placeholder="newPassword" className=" text-black placeholder:text-green-500 placeholder:italic rounded-md bg-transparent outline-none border-0 border-b-2 p-0 focus:p-2 " />
                <span
                className='absolute right-0 top-0 text-lg cursor-pointer'
                >👁️</span>
              </div>
           </div>
           <button type="submit" className="p-2 text-xl mr-auto bg-transparent text-black rounded-md font-bold"
            disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Change Password'}
            </button>
            {success && <p className="text-yellow-500">{success}</p>}
            {error && <p className="text-red-800">{error}</p>}
        </form>:
          <p className="text-green-500 font-semibold text-2xl mb-4 ml-auto mr-4">
                <button
                onClick={() => setChangePassword(true)}
                
                >Change Password?</button>
          </p>
        }
      </div>
    </div>
  )
}
