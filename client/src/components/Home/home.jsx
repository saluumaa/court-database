import { useContext, useEffect, useState } from "react";
import {motion} from 'framer-motion';
import { AuthContext } from "../../context/AuthContext";
import { ArrowLeft } from "react-feather";
import { Link } from "react-router-dom";
import apiRequest from "../../utils/apiRequest";
import Dashboard from "../dashboard/Dashboard";

const Home = () => {
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);

  useEffect(() => {
      fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      let response = await apiRequest.get('/cases');
      if (!response.ok) {
        setError(response.data.message);
      }
      setCases(response.data);
      
      setLoading(false);
     
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    return caseItem.case_number.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.first_name.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.second_name.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.case_type.toLowerCase().includes(search.toLowerCase());
  });


  const handleSearch = (e) => {
    e.preventDefault();
    fetchCases();
  };

  const handleLogout = () => {
    logout();
  };

  return (

    <div className='flex flex-col justify-center items-center w-full mb-20'>
      {/* Header */}
    <div className="w-full  relative bg-green-600 py-20">
        <div className="absolute inset-0">
            <img
              src="./court image.jpg"
              alt="Contact background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative px-2 sm:px-6 lg:px-8 ">
          <div className='flex gap-4 justify-end cursor-pointer'>
           < Dashboard />
          </div>
        </div>
      </div>


     

      <motion.div className='flex flex-col justify-center items-center w-full mt-16'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <p className='md:text-xl text-justify font-bold'>
          Please fill in the form below to continue searching
        </p>
        <form className='flex flex-col justify-center items-center md:flex-row md:flex-wrap w-full mt-10' onSubmit={handleSearch}>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="case-num"
            placeholder='CaseNumber, Names or CaseType'
            className='w-2/3 p-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent'
          />
          <button type='submit' className='w-2/3 p-2 mt-4 bg-yellow-500 text-white rounded-lg focus:outline-none'>
            Submit
          </button>
        </form>
      </motion.div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredCases.length > 0 && (
        <motion.div className='flex flex-col justify-center  w-full mt-16 overflow-x-scroll'
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className='md:text-2xl font-bold text-center'>Search Results</p>
          <table className="w-full">
            <thead>
              <tr className='bg-yellow-500 text-white'>
               <th className="p-2">Gal Dac.Lambar</th>
                {/* <th className="p-2">Dacwoode/to</th>
                <th className="p-2">Dacwaysan/e</th> */}
                <th className="p-2">Nooca Dacwada</th>
                <th className="p-2">Ujeedka Dacwada</th>
                <th className="p-2">Qodobka Dacwada</th>
                <th className="p-2">Racfaan laga qaatay?</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className="p-2">{caseItem.case_number}</td>
                  {/* <td className="p-2">{caseItem.first_name}</td>
                  <td className="p-2">{caseItem.second_name}</td> */}
                  <td className="p-2">{caseItem.case_origin}</td>
                  <td className="p-2">{caseItem.case_type}</td>
                  <td className="p-2 ">{caseItem.case_code}</td>
                  <td className="p-2 ">
                    <span className={caseItem.has_appeal ? 'text-green-700' : 'text-red-500' }>
                    {caseItem.has_appeal ? 'Haa' : 'Maya'}
                    </span>
                  </td>
                </tr>
              ))}

           </tbody>
          </table>
        </motion.div>
      )}
     
    </div>
  );
};

export default Home;