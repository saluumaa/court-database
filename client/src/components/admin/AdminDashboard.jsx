import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import apiRequest from '../../utils/apiRequest';


Chart.register(ChartDataLabels);

const AdminDashboard = () => {
  const [cases, setCases] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [expandedCases, setExpandedCases] = useState({}); // Tracks toggled "Read More"

  // Fetch all cases for summary data
  const fetchAllCases = async () => {
    try {
      let response = await apiRequest.get('/cases');
      const allCases = response.data
      generateSummary(allCases); 
    } catch (error) {
      console.error('Error fetching all cases:', error);
    }
  };

  // Fetch paginated cases for table data
  const fetchCases = async (page = 1) => {
    try {
      const response = await apiRequest.get(`/admin/allCases?page=${page}&limit=10`);
      const { data, pagination } = response.data;
      setCases(data);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  useEffect(() => {
    fetchAllCases(); 
    fetchCases(); 
  }, []);

  const generateSummary = (allCases) => {
    const summaryData = {
      totalCases: allCases.length,
      monthlyCases: {},
      caseOrigins: {},
    };

    allCases.forEach((c) => {
      const month = new Date(c.date).toLocaleString('default', { month: 'short' });
      const origin = c.case_origin.toLowerCase(); 

      // Monthly Cases
      summaryData.monthlyCases[month] = (summaryData.monthlyCases[month] || 0) + 1;

      // Case Origins
      summaryData.caseOrigins[origin] = (summaryData.caseOrigins[origin] || 0) + 1;
    });

    setSummary(summaryData);
  };

  // const caseOriginsChart = {
  //   labels: Object.keys(summary.caseOrigins || {}).map((origin) =>
  //     origin.charAt(0).toUpperCase() + origin.slice(1)
  //   ),
  //   datasets: [
  //     {
  //       label: 'Case Origins (%)',
  //       data: Object.values(summary.caseOrigins || {}).map(
  //         (count) => ((count / summary.totalCases) * 100).toFixed(2)
  //       ),
  //       backgroundColor: ['#34D399', '#60A5FA', '#FBBF24', '#EF4444'],
  //     },
  //   ],
  // };

  
  const caseOriginsChart = {
    labels: Object.keys(summary.caseOrigins || {}).map((origin) =>
      origin.charAt(0).toUpperCase() + origin.slice(1)
    ),
    datasets: [
      {
        label: 'Case Origins (%)',
        data: Object.values(summary.caseOrigins || {}).map(
          (count) => ((count / summary.totalCases) * 100).toFixed(2)
        ),
        backgroundColor: ['#34D399', '#60A5FA', '#FBBF24', '#EF4444'],
      },
    ],
    plugins: [ChartDataLabels],
  };
  
  const options = {
    plugins: {
      datalabels: {
        color: '#fff', 
        formatter: (value) => `${value}%`, 
        font: {
          weight: 'bold',
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };
  
  const monthlyCasesChart = {
    labels: Object.keys(summary.monthlyCases || {}),
    datasets: [
      {
        label: 'Monthly Cases',
        data: Object.values(summary.monthlyCases || {}),
        backgroundColor: '#7865F1',
      },
    ],
  };


  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCases(page);
    }
  };

  const toggleReadMore = (caseNumber) => {
    setExpandedCases((prev) => ({
      ...prev,
      [caseNumber]: !prev[caseNumber],
    }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Cases</h2>
          <p className="text-4xl font-bold text-green-500">{summary.totalCases || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">NoocaDacwada (%)</h2>
          <Pie data={caseOriginsChart} options={options} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Cases</h2>
          <Bar data={monthlyCasesChart}   />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow h-96 overflow-x-auto overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Case Details</h2>
        <table className="min-w-full mb-24 table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Case Number</th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Second Name</th>
              <th className="border border-gray-300 px-4 py-2">Case Origin</th>
              <th className="border border-gray-300 px-4 py-2">Court Decision</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.case_number}>
                <td className="border border-gray-300 px-4 py-2 uppercase">{c.case_number}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{c.first_name}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{c.second_name}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{c.case_origin}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {!c.court_decision ? (
                    <p>No court decision yet</p>
                  ) : (
                    <p>
                      {expandedCases[c.case_number] ? (
                        <span dangerouslySetInnerHTML={{ __html: c.court_decision }} />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: c.court_decision.substring(0, 100),
                          }}
                        />
                      )}
                      {c.court_decision.length > 100 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleReadMore(c.case_number)}
                        >
                          {expandedCases[c.case_number] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between -mt-20 mb-14">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
