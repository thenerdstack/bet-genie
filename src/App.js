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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://aitable.ai/fusion/v1/datasheets/dstrvoFBNJZmQa3aN7/records?viewId=viwEutEyNK3Pp&fieldKey=name",
          {
            headers: {
              Authorization: "Bearer uskx1EGMQucTM0x4h8wXuVV"
            }
          }
        );
        setData(response.data.data.records);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
        <div className="space-y-8">
          <Column title="Vegas Says" category="vegas" data={data} />
          <Column title="Fantasy Says" category="fantasy" data={data} />
          <Column title="Match Up Says" category="matchup" data={data} />
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, category, data }) => {
  const filteredData = data.filter(item => item.fields.Category === category);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{title}</h2>
      {filteredData.map((item, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">{new Date(item.fields.Date).toLocaleDateString()}</p>
          <div className="mt-2 prose prose-invert max-w-none">
            <ReactMarkdown>{item.fields.Content}</ReactMarkdown>
          </div>
          <a href={item.fields.Source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Source
          </a>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
