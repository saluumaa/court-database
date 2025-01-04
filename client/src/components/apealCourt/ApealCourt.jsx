import React, { useContext, useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import {motion} from 'framer-motion';
import apiRequest from '../../utils/apiRequest';
import CaseForm from '../newCase/CaseForm'; 
import { Link } from 'react-router-dom'; 

const ApealCourt = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchCases();
    } else {
      setError('Please login to view this page');
    }
  }, [currentUser]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/cases/myCases');
      if(response.status === 200) {
        setCases(response.data);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };



  const filteredCases = cases.filter((caseItem) => {
    return (
      caseItem.case_number.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.first_name.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.second_name.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.case_type.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddCaseSubmit = () => {
    setShowForm(false); 
    fetchCases(); // Refresh cases after adding a new case
  };

  const handleDeleteCase = async (id) => {
    try {
      await apiRequest.delete(`/cases/${id}`);
      fetchCases(); // Refresh cases after deletion
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-700'>{error}</div>;
  }

  return (
    <motion.div className='flex flex-col items-center'
    initial={{ opacity: 0, y: '-100%' }}
    animate={{ opacity: 1, y: 0, transition: { duration: 1.2, type: 'spring' } }}
    exit={{ opacity: 0 }}
    >
      <h1 className='text-3xl font-bold'>District Court Cases</h1>
      
      {!showForm && (
        <div className='flex flex-col w-full'>
          <input
            type='text'
            placeholder='Search cases...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='p-2 border rounded mt-4'
          />
          <button
            className='bg-green-500 w-44 text-white p-2 rounded-lg mt-4 flex items-center gap-2 justify-center focus:outline-none'
            onClick={() => setShowForm(true)}
          >
            <FaPlus className='inline' /> Add New Data
          </button>
        </div>
      )}

      {showForm && (
        <CaseForm onFormSubmit={handleAddCaseSubmit} onCancel={() => setShowForm(false)} />
      )}

      <section className='flex flex-col w-full mt-4 overflow-x-auto mb-40'>
        <table className='w-full'>
          <thead>
            <tr className='bg-yellow-500 text-white'>
              <th className='p-2'>Dacwoode</th>
              <th className='p-2'>Dacwaysane</th>
              <th className='p-2'>Gal Dac.Lambar</th>
              <th className='p-2'>Qodobka</th>
              <th className='p-2'>Maalinta La furay</th>
              <th className='p-2'>Nooca Dacwada</th>
              <th className='p-2'>Ujeedka Dacwada</th>
              <th className='p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className='p-2 capitalize'>{caseItem.first_name}</td>
                  <td className='p-2 capitalize'>{caseItem.second_name}</td>
                  <td className='p-2 uppercase'>{caseItem.case_number}</td>
                  <td className='p-2 uppercase'>{caseItem.case_code}</td>
                  <td className='p-2'>{new Date(caseItem.date).toLocaleDateString()}</td>
                  <td className='p-2 capitalize'>{caseItem.case_type}</td>
                  <td className='p-2 capitalize'>{caseItem.case_origin}</td>
                  <td className='p-2 flex gap-5'>
                    <Link to={`/mycase/${caseItem.id}`}>
                      <FaEdit className='text-green-600' />
                    </Link>
                    <FaTrash 
                      className='text-red-600 cursor-pointer' 
                      onClick={() => handleDeleteCase(caseItem.id)} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='text-red-700 text-center'>
                  No cases found or you are not authorized to view this page
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </motion.div>
  );
};

export default ApealCourt;