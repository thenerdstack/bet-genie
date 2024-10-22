import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OffenseComparisonChart = ({ teamStats, team1, team2 }) => {
  const team1Stats = teamStats.find(stats => stats.team === team1);
  const team2Stats = teamStats.find(stats => stats.team === team2);

  if (!team1Stats || !team2Stats) {
    return <div>Team stats not found</div>;
  }

  const statComparisons = [
    { label: 'Points Per Game', team1: team1Stats.points_per_game, team2: team2Stats.points_per_game },
    { label: 'Yards Per Game', team1: team1Stats.total_yards / team1Stats.games_played, team2: team2Stats.total_yards / team2Stats.games_played },
    { label: 'First Downs Per Game', team1: team1Stats.first_downs_made / team1Stats.games_played, team2: team2Stats.first_downs_made / team2Stats.games_played },
    { label: 'Red Zone %', team1: team1Stats.red_zone_percentage, team2: team2Stats.red_zone_percentage },
  ];

  const data = {
    labels: statComparisons.map(comp => comp.label),
    datasets: [
      {
        label: team1,
        data: statComparisons.map(comp => (comp.team1 / (comp.team1 + comp.team2)) * 100),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: team2,
        data: statComparisons.map(comp => (comp.team2 / (comp.team1 + comp.team2)) * 100),
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
        text: 'Offensive Comparison',
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

export default OffenseComparisonChart;