import React, { useContext, useState } from 'react';
import {motion} from 'framer-motion';
import { FaBars, FaTimesCircle } from 'react-icons/fa';
import { Link, useLocation} from 'react-router-dom';
import styles from './navbar.module.css'; 
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`md:w-56  h-screen bg-yellow-500 flex ${styles.navbarContainer} rounded-r-3xl shadow-lg m-0 flex-shrink-0 ${isOpen ? 'w-72' : 'w-0'}`
    }>
      {/* Toggle button for mobile view */}
      <button 
        className={`${styles.toggleButton} md:hidden absolute top-4 left-4 z-20`} 
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimesCircle size={50} className='mt-3 fixed top-0 left-56 ' /> : <FaBars size={40} className='mt-3 text-yellow-500' />}
      </button>

      {/* Nav menu */}
      <motion.nav className={`flex flex-col  items-center ${isOpen ? 'flex text-4xl' : 'hidden'} md:flex`}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Link to='/' className={`rounded-full shadow-lg p-2 text-lg mb-20 ${styles.logo}`}>
          <img src="/court-logo.png" alt="Court Logo" className='rounded-full' />
        </Link>

        <motion.ul className={`flex flex-col items-center md:text-lg lg:text-4xl ${styles.navLinks}`}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <li className={`rounded-lg p-2 text-lg mb-4 ${styles.navItem}  ${location.pathname === '/district' ? styles.active : ''} `}>
            <Link to='/district'>District Court</Link>
          </li>
          <li className={`rounded-lg p-2 text-lg mb-4 ${styles.navItem} ${location.pathname === '/regional' ? styles.active : ''}`}>
            <Link to='/regional'>Regional Court</Link>
          </li>
          <li className={`rounded-lg p-2 text-lg mb-4 ${styles.navItem} ${location.pathname === '/appeal' ? styles.active : ''}`}>
            <Link to='/appeal'>Appeal Court</Link>
          </li>
          {currentUser && currentUser.role === 'admin' && (
            <li className={`rounded-lg p-2 text-lg mb-4 ${styles.navItem} ${location.pathname === '/admin' ? styles.active : ''}`}>
              <Link to='/admin'>Admin Profile</Link>
            </li>
          )}

          <li className={`rounded-lg p-2 text-lg mb-4 ${styles.navItem} ${location.pathname === '/login' ? styles.active : ''}`}>
            <Link to='/login'>Login</Link>
          </li>
        </motion.ul>
      </motion.nav>
    </aside>
  );
};

export default Navbar;
