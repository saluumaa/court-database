
import { FaSave, FaTimes } from 'react-icons/fa';
import Editor from '../../Editor';

const EditCaseForm = ({
  editFormData,
  handleInputChange,
  saveChanges,
  setIsEditing,
  getCurrentDate,
  isEditing,
  handleAppealChange
}) => {
  return (
    <div className="flex flex-col gap-3 mb-16 p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Edit Case</h2>
      <section className='flex flex-col md:flex-row gap-5  flex-wrap rounded-md '>
        <input
          type="text"
          name="first_name"
          value={editFormData.first_name || ''}
          onChange={handleInputChange}
          placeholder="First Name"
          className="mb-2 flex-1 rounded-md p-3"
        />
        <input
          type="text"
          name="second_name"
          value={editFormData.second_name || ''}
          onChange={handleInputChange}
          placeholder="Second Name"
          className="mb-2 flex-1 rounded-md p-3"
        />
        <input
          type="text"
          name="case_type"
          value={editFormData.case_type || ''}
          onChange={handleInputChange}
          placeholder="Case Type"
          className="mb-2 flex-1 rounded-md p-3"
        />
        <input
          type="text"
          name="case_number"
          value={editFormData.case_number || ''}
          onChange={handleInputChange}
          placeholder="Case Number"
          className="mb-2 flex-1 rounded-md p-3"
        />
        <input
          type="date"
          name="date"
          value={editFormData.date || ''}
          onChange={handleInputChange}
          placeholder="Case Start Date"
          className="mb-2 flex-1 rounded-md p-3"
          max={getCurrentDate()} 
        />
       <span>
        Racfaan laga qaatay
        <input
          type='checkbox'
          name='has_appeal'
          className='form-checkbox h-5 w-5 text-blue-600 rounded-md p-3 flex-1 '
          checked={editFormData.has_appeal || false} // Reflects `editFormData` state
          onChange={(e) => {
            handleAppealChange(isEditing, e.target.checked); // Updates state and `editFormData`
          }}
        />

       </span>
       <div className='flex flex-1 items-center '>
       <label className='text-md w-1/2 '>Dhamaadka File ka:  </label>
        <input
          type="date"
          name="case_finish_date"
          value={editFormData.case_finish_date || ''}
          onChange={handleInputChange}
          placeholder="Case Finish Date"
          className="mb-2 rounded-md ml-2 p-3 w-full "
          max={getCurrentDate()} 
        />
        </div>
      
        <Editor 
          type="text"
          // name="court_decision"
          value={editFormData.court_decision || ''}
          onChange={(content) => handleInputChange(content, 'court_decision')}
          placeholder="Court Decision"
          className="mb-2 flex-1 rounded-md p-3"
        />
        
      </section>
      <div className="flex justify-end mt-20">
        <button onClick={() => saveChanges(isEditing)} className="px-4 py-2 bg-green-500 text-white rounded mr-2">
          <FaSave /> Save
        </button>
        <button onClick={() => setIsEditing(null)} className="px-4 py-2 bg-red-500 text-white rounded">
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default EditCaseForm;
