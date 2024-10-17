import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';

// const Dashboard = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://aitable.ai/fusion/v1/datasheets/dstrvoFBNJZmQa3aN7/records?viewId=viwEutEyNK3Pp&fieldKey=name",
//           {
//             headers: {
//               Authorization: "Bearer uskx1EGMQucTM0x4h8wXuVV"
//             }
//           }
//         );
//         setData(response.data.data.records);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
//         <div className="space-y-8">
//           <Column title="Vegas Says" category="vegas" data={data} />
//           <Column title="Fantasy Says" category="fantasy" data={data} />
//           <Column title="Match Up Says" category="matchup" data={data} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Column = ({ title, category, data }) => {
//   const filteredData = data.filter(item => item.fields.Category === category);

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{title}</h2>
//       {filteredData.map((item, index) => (
//         <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
//           <p className="text-sm text-gray-300">{new Date(item.fields.Date).toLocaleDateString()}</p>
//           <div className="mt-2 prose prose-invert max-w-none">
//             <ReactMarkdown>{item.fields.Content}</ReactMarkdown>
//           </div>
//           <a href={item.fields.Source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
//             Source
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';

// const Dashboard = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://aitable.ai/fusion/v1/datasheets/dstrvoFBNJZmQa3aN7/records?viewId=viwEutEyNK3Pp&fieldKey=name",
//           {
//             headers: {
//               Authorization: "Bearer uskx1EGMQucTM0x4h8wXuVV"
//             }
//           }
//         );

//         // Sort data by date (newest first) and get the most recent entry for each category
//         const sortedData = response.data.data.records.sort((a, b) => b.fields.Date - a.fields.Date);
//         const latestData = {};
//         sortedData.forEach(item => {
//           if (!latestData[item.fields.Category] || item.fields.Date > latestData[item.fields.Category].fields.Date) {
//             latestData[item.fields.Category] = item;
//           }
//         });

//         setData(Object.values(latestData));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
//         <div className="space-y-8">
//           <Column title="Vegas Says" category="vegas" data={data} />
//           <Column title="Fantasy Says" category="fantasy" data={data} />
//           <Column title="Match Up Says" category="matchup" data={data} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Column = ({ title, category, data }) => {
//   const columnData = data.find(item => item.fields.Category === category);

//   if (!columnData) {
//     return (
//       <div className="bg-gray-800 rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{title}</h2>
//         <p>No data available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{title}</h2>
//       <div className="mb-4 p-4 bg-gray-700 rounded-lg">
//         <p className="text-sm text-gray-300">{new Date(columnData.fields.Date).toLocaleDateString()}</p>
//         <div className="mt-2 prose prose-invert max-w-none">
//           <ReactMarkdown>{columnData.fields.Content}</ReactMarkdown>
//         </div>
//         <a href={columnData.fields.Source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
//           Source
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';

// const Dashboard = () => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://aitable.ai/fusion/v1/datasheets/dstrvoFBNJZmQa3aN7/records?viewId=viwEutEyNK3Pp&fieldKey=name",
//           {
//             headers: {
//               Authorization: "Bearer uskx1EGMQucTM0x4h8wXuVV"
//             }
//           }
//         );

//         // Group data by category and source, keeping only the latest entry for each
//         const groupedData = response.data.data.records.reduce((acc, item) => {
//           const { Category, Source } = item.fields;
//           if (!acc[Category]) acc[Category] = {};
//           if (!acc[Category][Source] || item.fields.Date > acc[Category][Source].fields.Date) {
//             acc[Category][Source] = item;
//           }
//           return acc;
//         }, {});

//         setData(groupedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
//         <div className="space-y-8">
//           <Column title="Vegas Says" category="vegas" data={data.vegas || {}} />
//           <Column title="Fantasy Says" category="fantasy" data={data.fantasy || {}} />
//           <Column title="Match Up Says" category="matchup" data={data.matchup || {}} />
//           <Column title="Injuries" category="injuries" data={data.injuries || {}} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Column = ({ title, category, data }) => {
//   const [expandedSections, setExpandedSections] = useState({});

//   useEffect(() => {
//     const initialExpandedState = Object.keys(data).reduce((acc, sourceKey) => {
//       acc[sourceKey] = false;
//       return acc;
//     }, {});
//     setExpandedSections(initialExpandedState);
//   }, [data]);

//   const toggleSection = (sourceKey) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sourceKey]: !prev[sourceKey]
//     }));
//   };

//   const getSectionTitle = (item, sourceKey) => {
//     return item.fields.Title || item.fields.Name || item.fields.Source || `Section ${sourceKey}`;
//   };

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-semibold mb-6 text-yellow-400">{title}</h2>
//       {Object.entries(data).length === 0 ? (
//         <p>No data available</p>
//       ) : (
//         Object.entries(data).map(([sourceKey, item], index) => (
//           <div key={index} className="mb-6 bg-gray-700 rounded-lg overflow-hidden shadow-md">
//             <button 
//               onClick={() => toggleSection(sourceKey)}
//               className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-600 transition-colors duration-200"
//             >
//               <span className="font-bold text-lg text-cyan-300 flex items-center">
//                 <span className="mr-2 text-xl">📌</span>
//                 {getSectionTitle(item, sourceKey)}
//               </span>
//               <span className="text-gray-400">{expandedSections[sourceKey] ? '▲' : '▼'}</span>
//             </button>
//             {expandedSections[sourceKey] && (
//               <div className="p-4 border-t border-gray-600">
//                 <p className="text-sm text-gray-400 mb-3">{new Date(item.fields.Date).toLocaleDateString()}</p>
//                 <div className="prose prose-invert max-w-none">
//                   <ReactMarkdown>{item.fields.Content}</ReactMarkdown>
//                 </div>
//                 {/* <a href={item.fields.Source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mt-3 inline-block">
//                   Source
//                 </a> */}
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Dashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://aitable.ai/fusion/v1/datasheets/dstrvoFBNJZmQa3aN7/records?viewId=viwEutEyNK3Pp&fieldKey=name",
          {
            headers: {
              Authorization: "Bearer uskx1EGMQucTM0x4h8wXuVV"
            }
          }
        );

        const groupedData = response.data.data.records.reduce((acc, item) => {
          const { Category, Source } = item.fields;
          if (!acc[Category]) acc[Category] = {};
          if (!acc[Category][Source] || item.fields.Date > acc[Category][Source].fields.Date) {
            acc[Category][Source] = item;
          }
          return acc;
        }, {});

        setData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
        <div className="space-y-8">
          <Column title="Vegas Says" category="vegas" data={data.vegas || {}} isLoading={isLoading} />
          <Column title="Fantasy Says" category="fantasy" data={data.fantasy || {}} isLoading={isLoading} />
          <Column title="Match Up Says" category="matchup" data={data.matchup || {}} isLoading={isLoading} />
          <Column title="Injuries" category="injuries" data={data.injuries || {}} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, category, data, isLoading }) => {
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const initialExpandedState = Object.keys(data).reduce((acc, sourceKey) => {
      acc[sourceKey] = true;
      return acc;
    }, {});
    setExpandedSections(initialExpandedState);
  }, [data]);

  const toggleSection = (sourceKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sourceKey]: !prev[sourceKey]
    }));
  };

  const getSectionTitle = (item, sourceKey) => {
    return item.fields.Title || item.fields.Name || item.fields.Source || `Section ${sourceKey}`;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-400">{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-yellow-400">{title}</h2>
      {Object.entries(data).length === 0 ? (
        <p>No data available</p>
      ) : (
        Object.entries(data).map(([sourceKey, item], index) => (
          <div key={index} className="mb-6 bg-gray-700 rounded-lg overflow-hidden shadow-md">
            <button 
              onClick={() => toggleSection(sourceKey)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-600 transition-colors duration-200"
            >
              <span className="font-bold text-lg text-cyan-300 flex items-center">
                <span className="mr-2 text-xl">📌</span>
                {getSectionTitle(item, sourceKey)}
              </span>
              <span className="text-gray-400">{expandedSections[sourceKey] ? '▲' : '▼'}</span>
            </button>
            {expandedSections[sourceKey] && (
              <div className="p-4 border-t border-gray-600">
                <p className="text-sm text-gray-400 mb-3">{new Date(item.fields.Date).toLocaleDateString()}</p>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{item.fields.Content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;