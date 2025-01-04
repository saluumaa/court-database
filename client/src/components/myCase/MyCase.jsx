import React, { useEffect, useState } from 'react';
import apiRequest from '../../utils/apiRequest';
import { useParams } from 'react-router-dom';
import formDate from '../../utils/dateFormatter';
import { FaEdit } from 'react-icons/fa';
import EditCaseForm from './EditCase';

const MyCase = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [appealStates, setAppealStates] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get(`/cases/myCases/${id}`);
      if (!response.ok) {
        setError(response.data.message);
      }
      const fetchedCases = Array.isArray(response.data) ? response.data : [response.data];
      setCases(fetchedCases);


      const initialAppealStates = {};
      fetchedCases.forEach((caseItem) => {
        const storedAppeal = localStorage.getItem(`case_${caseItem.id}_hasAppeal`) === 'true';
        initialAppealStates[caseItem.id] = storedAppeal;
      });
      setAppealStates(initialAppealStates);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAppealChange = (caseId, isChecked) => {
    setAppealStates((prev) => ({
      ...prev,
      [caseId]: isChecked,
    }));
    localStorage.setItem(`case_${caseId}_hasAppeal`, isChecked);

    if (isEditing === caseId) {
      setEditFormData((prev) => ({
        ...prev,
        has_appeal: isChecked,
      }));
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const startEditing = (caseItem) => {
    setIsEditing(caseItem.id);
    setEditFormData({ ...caseItem });
  };

  const handleInputChange = (e, field) => {
   if(typeof e === 'string') {
     setEditFormData((prev) => ({
       ...prev,
       [field]: e,
     }));
   } else {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
   }
  };

  const saveChanges = async (caseId) => {
    try {
      const response = await apiRequest.put(`/cases/${caseId}`, {
        ...editFormData,
      });
      
      if(response.status === 200) {
        setIsEditing(null);
        fetchCaseDetails();
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className='flex flex-col justify-center w-full mx-auto mb-16'>
      {isEditing && (
        <EditCaseForm
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleAppealChange= {handleAppealChange}
          saveChanges={saveChanges}
          setIsEditing={setIsEditing}
          getCurrentDate={getCurrentDate}
          isEditing={isEditing}
        />
      )}

      <div className='flex flex-col justify-center items-center md:flex-row md:flex-wrap'>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {Array.isArray(cases) && cases.map((caseItem) => (
          <div key={caseItem.id} className='flex flex-col justify-center w-full mb-4 border-b pb-4'>
            <div className='flex justify-between w-full items-center'>
              <h1 className='text-xl font-bold'>{`${caseItem.first_name}'s File`}</h1>
              <button onClick={() => startEditing(caseItem)} className="px-2 flex items-center gap-1 font-bold italic">
                <FaEdit className="text-green-600" /> Edit file
              </button>
            </div>
            <div className='flex justify-between w-full text-md lg:text-lg mt-3 font-bold'>
              <p>{caseItem.case_number}</p>
              <p>{formDate(caseItem.date)}</p>
            </div>
            <section className='flex flex-col lg:flex-row lg:justify-between flex-wrap gap-3 px-3'>
              <div className='flex mt-4 flex-col flex-1'>
                <p><span className='font-bold pr-2'>Dacwooto/de:</span> {caseItem.first_name}</p>
                <p><span className='font-bold pr-2'>Dacwaysan/e:</span> {caseItem.second_name}</p>
                <p><span className='font-bold pr-2'>Dacwadu waxa ay khusaysaa:</span> {caseItem.case_type}</p>
              </div>
              <div className='  text-justify lg:flex-1'>
              <h3 className='text-lg font-bold underline'>Xukunka/Qaraarka Maxkamada</h3>
                {!caseItem.court_decision ? (
                  <p>No court decision yet</p>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: caseItem.court_decision }}></p>
                )}
              </div>
            
            </section>
            <section className='flex flex-col lg:flex-row mt-7 w-full lg:justify-center lg:items-center'>
            <div className='flex mt-2 md:mt-1 flex-1  mb-3'>
                <p>
                  <span className='h-5 pr-1 scroll-pt-2 text-lg font-bold italic'>Racfaan Laga Qaatay: </span>
                  <input
                    type='checkbox'
                    className='form-checkbox h-5 w-5 text-blue-600 -mt-5'
                    checked={appealStates[caseItem.id] || false}
                    disabled={isEditing !== caseItem.id}  // Disable if not editing the current case
                    onChange={(e) => {
                      if (isEditing === caseItem.id) { // Allow change only when editing
                        handleAppealChange(caseItem.id, e.target.checked);
                        handleInputChange(e, 'has_appeal'); // Ensure `editFormData` captures the change
                      }
                    }}
                  />

                </p>
              </div>

            <div className='italic text-lg  '>
              {!caseItem.case_finish_date ? (
                <p><span className='text-lg font-bold'>wakhtigu dhamaaday: </span>Case is still ongoing</p>
              ) : (
                <p className='font-semibold'>{`Case finished on: ${formDate(caseItem.case_finish_date)}`}</p>
              )}
            </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCase;
