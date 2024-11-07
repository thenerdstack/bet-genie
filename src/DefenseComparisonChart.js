import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const normalizeTeamName = (teamName) => {
    return teamName.toLowerCase().split(' ').pop(); // Return the last word (usually the team nickname)
  };
  

const parseNumeric = (value) => {
    if (typeof value === 'string') {
      return parseFloat(value.replace('+', ''));
    }
    return value;
  };
  

const DefenseComparisonChart = ({ teamStats, team1, team2 }) => {
    const findTeamStats = (teamName) => {
        const normalizedName = normalizeTeamName(teamName);
        return teamStats.find(stats => normalizeTeamName(stats.team) === normalizedName);
      };

//   const team1Stats = teamStats.find(stats => stats.team === team1);
//   const team2Stats = teamStats.find(stats => stats.team === team2);
    const team1Stats = findTeamStats(team1);
    const team2Stats = findTeamStats(team2);

  if (!team1Stats || !team2Stats) {
    return <div>Team stats not found</div>;
  }


const statComparisons = [
    { label: 'Points Allowed Per Game', team1: parseNumeric(team1Stats?.points_allowed_per_game), team2: parseNumeric(team2Stats?.points_allowed_per_game), invert: true },
    { label: 'Yards Per Play Allowed', team1: parseNumeric(team1Stats?.yards_per_play_allowed), team2: parseNumeric(team2Stats?.yards_per_play_allowed), invert: true },
    { label: 'First Downs % Allowed', team1: parseNumeric(team1Stats?.first_downs_percentage_allowed), team2: parseNumeric(team2Stats?.first_downs_percentage_allowed), invert: true },
    { label: 'Red Zone % Allowed', team1: parseNumeric(team1Stats?.red_zone_allowed?.percentage), team2: parseNumeric(team2Stats?.red_zone_allowed?.percentage), invert: true },
  ];
  

  const data = {
    labels: statComparisons.map(comp => comp.label),
    datasets: [
      {
        label: team1,
        data: statComparisons.map(comp => comp.invert ? (1 - (comp.team1 / (comp.team1 + comp.team2))) * 100 : (comp.team1 / (comp.team1 + comp.team2)) * 100),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: team2,
        data: statComparisons.map(comp => comp.invert ? (1 - (comp.team2 / (comp.team1 + comp.team2))) * 100 : (comp.team2 / (comp.team1 + comp.team2)) * 100),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Defensive Comparison',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            const actualValue = statComparisons[dataIndex][datasetIndex === 0 ? 'team1' : 'team2'];
            return `${context.dataset.label}: ${actualValue.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default DefenseComparisonChart;