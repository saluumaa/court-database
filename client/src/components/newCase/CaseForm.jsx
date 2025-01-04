import React, { useState } from 'react';
import apiRequest from '../../utils/apiRequest';


const CaseForm = ({ onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    case_number: '',
    first_name: '',
    second_name: '',
    case_origin: '',
    case_type: '',
    case_code: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post('/cases/', formData);
      if (response.status === 200 || response.status === 201) { 
        onFormSubmit(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center w-full mt-4'>
      <h2 className='text-2xl font-bold'>Add New Case</h2>
      <form className='flex flex-col w-full mx-auto  mt-4' onSubmit={handleSubmit}>
      <section className='flex flex-col w-full md:flex-row flex-wrap md:gap-4 '>
        
        <div className='md:flex  flex flex-col md:flex-1  md:gap-3 mx-a'>
        <label htmlFor='case_number' className='mb-2'>Case Number</label>
        <input type='text' name='case_number' id='case_number' value={formData.case_number} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='first_name' className='mb-2'>Magaca qofka dacwada leh</label>
        <input type='text' name='first_name' id='first_name' value={formData.first_name} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='second_name' className='mb-2'>Magaca dacwaysanaha</label>
        <input type='text' name='second_name' id='second_name' value={formData.second_name} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='case_origin' className='mb-2'>Nooca Dacwada</label>
        <input type='text' name='case_origin' id='case_origin' value={formData.case_origin} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='case_type' className='mb-2'>Ujeedada Dacwada</label>
        <input type='text' name='case_type' id='case_type' value={formData.case_type} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='case_code' className='mb-2'>Qodobka Dacwada</label>
        <input type='text' name='case_code' id='case_code' value={formData.case_code} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>

        <div className='md:flex flex-col flex md:flex-1 md:gap-3'>
        <label htmlFor='date' className='mb-2'>Maalinta La furay</label>
        <input type='date' name='date' id='date' value={formData.date} onChange={handleChange} className='p-2 mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300' required />
        </div>
        </section>


        <div className='flex gap-4 w-14'>
        <button type='submit' className='bg-green-500 text-white px-7 py-3 rounded-lg mt-4 text-lg'
         
        >Save</button>
        <button type='button' className='bg-red-500 text-white px-7 py-3 rounded-lg mt-4 text-lg' onClick={onCancel}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;


