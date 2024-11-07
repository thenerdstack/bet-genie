import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import OffenseComparisonChart from './OffenseComparisonChart';
import DefenseComparisonChart from './DefenseComparisonChart';
import { HashRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';

const normalizeKey = (key) => key.toLowerCase().replace(/[_\s]/g, '');

const getNestedValue = (obj, path) => {
  const normalizedObj = Object.keys(obj).reduce((acc, key) => {
    acc[normalizeKey(key)] = obj[key];
    return acc;
  }, {});

  return path.split('.').reduce((current, key) => {
    return current && current[normalizeKey(key)] !== undefined ? current[normalizeKey(key)] : undefined;
  }, normalizedObj);
};

const generateSlug = (matchup) => {
  return matchup.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').toLowerCase();
};


const Dashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
  
      // Sort data by date (newest first)
      const sortedData = response.data.data.records.sort((a, b) => new Date(b.fields.Date) - new Date(a.fields.Date));
  
      // Get the most recent entry for each category
      const latestData = sortedData.reduce((acc, item) => {
        if (!acc[item.fields.Category] || new Date(item.fields.Date) > new Date(acc[item.fields.Category].fields.Date)) {
          acc[item.fields.Category] = item;
        }
        return acc;
      }, {});
  
      // Parse the content of the latest data
      const parsedData = Object.entries(latestData).reduce((acc, [category, item]) => {
        try {
          const customJSONParse = (jsonString) => {
            return JSON.parse(jsonString.replace(/:\s*\+/g, ': '));
          };
  
          if (category === 'teamStats2') {
            acc[category] = customJSONParse(item.fields.Content);
          } else {
            acc[category] = JSON.parse(item.fields.Content);
          }
          
          // If this is the trends data, parse it separately
          if (category === 'trends') {
            acc.trendsData = acc[category];
          }

          if (category === 'powerRankings') {
            acc[category] = JSON.parse(item.fields.Content);
          }

          if (category === 'hotPlayers') {
            acc[category] = JSON.parse(item.fields.Content);
          }
        } catch (error) {
          console.error(`Error parsing JSON content for ${category}:`, error);
        }
        return acc;
      }, {});
  
      console.log("Raw API response:", response.data);
      console.log("Parsed latest data:", parsedData);
  
      setData(parsedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Betting Dashboard</h1>
          <Routes>
            <Route path="/" element={<Overview data={data} />} />
            <Route path="/matchup/:slug" element={<MatchupPage data={data} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Overview = ({ data }) => {
  console.log("Data in Overview:", data);
  
  // const matchups = data.matchup && data.matchup["Trending Bets for Week"] ? data.matchup["Trending Bets for Week"] : [];
  const fantasy = data.fantasy || {};
  // const matchups = getNestedValue(data, 'matchup.Trending Bets for Week') || [];
  const matchups = data.vegas || [];


  return (
    <div>
      {/* <h2 className="text-2xl font-semibold mb-4">Fantasy Picks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Cash Game Picks</h3>
          <p><strong>QB:</strong> {fantasy.cashGameQuarterback?.name} ({fantasy.cashGameQuarterback?.team})</p>
          <p><strong>RB:</strong> {fantasy.cashGameRunningBacks?.map(rb => rb.name).join(', ')}</p>
          <p><strong>WR:</strong> {fantasy.cashGameWideReceivers?.map(wr => wr.name).join(', ')}</p>
          <p><strong>TE:</strong> {fantasy.cashGameTightEnds?.map(te => te.name).join(', ')}</p>
          <p><strong>DEF:</strong> {fantasy.defenseOptions?.map(def => def.name).join(', ')}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Tournament Picks</h3>
          <p><strong>QB:</strong> {fantasy.tournamentQuarterbacks?.map(qb => qb.name).join(', ')}</p>
          <p><strong>RB:</strong> {fantasy.tournamentRunningBacks?.map(rb => rb.name).join(', ')}</p>
          <p><strong>WR:</strong> {fantasy.tournamentWideReceivers?.map(wr => wr.name).join(', ')}</p>
          <p><strong>TE:</strong> {fantasy.tournamentTightEnds?.map(te => te.name).join(', ')}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-2">Additional Picks</h3>
        <p><strong>QB:</strong> {fantasy.additionalQuarterbacks?.join(', ')}</p>
        <p><strong>RB:</strong> {fantasy.additionalRunningBacks?.join(', ')}</p>
        <p><strong>WR:</strong> {fantasy.additionalWideReceivers?.join(', ')}</p>
        <p><strong>TE:</strong> {fantasy.additionalTightEnds?.join(', ')}</p>
        <p><strong>DEF:</strong> {fantasy.additionalDefenses?.join(', ')}</p>
        <p><strong>Tournament RB:</strong> {fantasy.additionalRunningBacksTournament?.join(', ')}</p>
        <p><strong>Tournament WR:</strong> {fantasy.additionalWideReceiversTournament?.join(', ')}</p>
        <p><strong>Tournament TE:</strong> {fantasy.additionalTightEndsTournament?.join(', ')}</p>
      </div> */}

      <h2 className="text-2xl font-semibold mb-4">🔥 Trending Players</h2>

      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        {data.hotPlayers && data.hotPlayers.length > 0 ? (
          data.hotPlayers.map((player, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-bold">{player.player} ({player.team})</p>
              <p className="text-sm text-gray-300">{player.trend}</p>
            </div>
          ))
        ) : (
          <p>No trending players available</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">All Matchups</h2>
        {matchups.length > 0 ? (
          matchups.map((bet, index) => (
            <Link key={index} to={`/matchup/${generateSlug(bet.game)}`} className="block mb-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700">
              <h3 className="text-xl font-bold">{bet.game}</h3>
              <p>Current Spread: {bet.current_spread}</p>
              <p>Recent Changes: {bet.recent_changes}</p>
            </Link>
          ))
        ) : (
          <p>No matchups available</p>
        )}
    </div>
  );
};


const MatchupPage = ({ data }) => {
  const { slug } = useParams();
  const matchups = data.vegas || [];
  const matchup = matchups.find(m => generateSlug(m.game) === slug);
  const trendsData = data.trends;
  const teamStats = data.teamStats;
  const teamStats2 = data.teamStats2;
  const bettingInsight = data.matchup && data.matchup["Trending Bets for Week"] ? 
    data.matchup["Trending Bets for Week"].find(m => generateSlug(m.matchup) === slug)?.betting_insight : 
    null;

  if (!matchup || !trendsData || !teamStats || !teamStats2) {
    return <div>Matchup, trends data, or team stats not found</div>;
  }

  // Declare team1 and team2 only once
  const [team1, team2] = matchup.game.split(' vs. ');

  // const findTeamData = (teamName) => {
  //   console.log('Searching for team:', teamName);
  //   if (data.powerRankings && Array.isArray(data.powerRankings.team_rankings)) {
  //     const teamNickname = teamName.split(' ').pop(); // Get the last word of the team name
  //     return data.powerRankings.team_rankings.find(team => {
  //       console.log('Comparing with:', team.team);
  //       return team.team.toLowerCase() === teamNickname.toLowerCase();
  //     });
  //   }
  //   return null;
  // };

  const findTeamData = (teamName) => {
    console.log('Searching for team:', teamName);
    if (data.powerRankings && Array.isArray(data.powerRankings.team_rankings)) {
      const teamWords = teamName.toLowerCase().split(' ');
      return data.powerRankings.team_rankings.find(team => {
        const powerRankingTeam = team.team.toLowerCase();
        console.log('Comparing with:', team.team);
        return teamWords.some(word => powerRankingTeam.includes(word)) ||
               powerRankingTeam.includes(teamWords[teamWords.length - 1]) ||
               teamWords.includes(powerRankingTeam);
      });
    }
    return null;
  };

  const team1Data = findTeamData(team1);
  const team2Data = findTeamData(team2);
  console.log(team1Data)
  const getTrendValue = (category, subcategory, field) => {
    const categoryVariations = [
      category,
      category.replace(/\s/g, '_'),
      category.replace(/_/g, ' '),
      category.toLowerCase(),
      category.toLowerCase().replace(/\s/g, '_'),
      category.toLowerCase().replace(/_/g, ' ')
    ];
  
    for (let cat of categoryVariations) {
      if (trendsData && trendsData[cat] && trendsData[cat].overall_performance && trendsData[cat].overall_performance[subcategory]) {
        return trendsData[cat].overall_performance[subcategory][field] || 'N/A';
      }
    }
  
    return 'N/A';
  };

  if (!matchup || !trendsData || !teamStats || !teamStats2) {
    return <div>Matchup, trends data, or team stats not found</div>;
  }

  console.log('trendsData in MatchupPage:', trendsData);
  console.log('powerRankings:', data.powerRankings);


  return (
    <div>
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">&larr; Back to Overview</Link>
      <h2 className="text-2xl font-semibold mb-4">{matchup.game}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{team1}</h3>
          <p className="mb-2">Power Rank: {team1Data?.power_rank || 'N/A'} ({team1Data?.change || 'N/A'})</p>
          <p>{team1Data?.summary || 'No summary available'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{team2}</h3>
          <p className="mb-2">Power Rank: {team2Data?.power_rank || 'N/A'} ({team2Data?.change || 'N/A'})</p>
          <p>{team2Data?.summary || 'No summary available'}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Offensive Comparison</h3>
        <OffenseComparisonChart teamStats={teamStats} team1={team1} team2={team2} />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Defensive Comparison</h3>
        <DefenseComparisonChart teamStats={teamStats2} team1={team1} team2={team2} />
      </div>

      {/* {bettingInsight && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-2">Betting Insight</h3>
          <p>{bettingInsight}</p>
        </div>
      )} */}

      {matchup && (
     <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">📌 Vegas Odds</h3>
        <p>Current Spread: {matchup.current_spread}</p>
        <p>Recent Changes: {matchup.recent_changes}</p>
        <p>Betting Shift: {matchup.betting_shift}</p>
      </div>
      )}

{/* <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">📌 Season-to-date Trends</h3>        
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Straight Up Trends</h4>
          <ul>
            <li>Away Teams: {getTrendValue('Straight Up Trends', 'away_teams', 'wins')}-{getTrendValue('Straight Up Trends', 'away_teams', 'losses')} ({getTrendValue('Straight Up Trends', 'away_teams', 'percentage')}%)</li>
            <li>Home Teams: {getTrendValue('Straight Up Trends', 'home_teams', 'wins')}-{getTrendValue('Straight Up Trends', 'home_teams', 'losses')} ({getTrendValue('Straight Up Trends', 'home_teams', 'percentage')}%)</li>
            <li>Favorites: {getTrendValue('Straight Up Trends', 'favorites', 'wins')}-{getTrendValue('Straight Up Trends', 'favorites', 'losses')} ({getTrendValue('Straight Up Trends', 'favorites', 'percentage')}%)</li>
            <li>Underdogs: {getTrendValue('Straight Up Trends', 'dogs', 'wins')}-{getTrendValue('Straight Up Trends', 'dogs', 'losses')} ({getTrendValue('Straight Up Trends', 'dogs', 'percentage')}%)</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold">Against the Spread Trends</h4>
          <ul>
            <li>Away Teams: {getTrendValue('Against the Spread Trends', 'away_teams', 'wins')}-{getTrendValue('Against the Spread Trends', 'away_teams', 'losses')}-{getTrendValue('Against the Spread Trends', 'away_teams', 'pushes')} ({getTrendValue('Against the Spread Trends', 'away_teams', 'percentage')}%)</li>
            <li>Home Teams: {getTrendValue('Against the Spread Trends', 'home_teams', 'wins')}-{getTrendValue('Against the Spread Trends', 'home_teams', 'losses')}-{getTrendValue('Against the Spread Trends', 'home_teams', 'pushes')} ({getTrendValue('Against the Spread Trends', 'home_teams', 'percentage')}%)</li>
            <li>Favorites: {getTrendValue('Against the Spread Trends', 'favorites', 'wins')}-{getTrendValue('Against the Spread Trends', 'favorites', 'losses')}-{getTrendValue('Against the Spread Trends', 'favorites', 'pushes')} ({getTrendValue('Against the Spread Trends', 'favorites', 'percentage')}%)</li>
            <li>Underdogs: {getTrendValue('Against the Spread Trends', 'dogs', 'wins')}-{getTrendValue('Against the Spread Trends', 'dogs', 'losses')}-{getTrendValue('Against the Spread Trends', 'dogs', 'pushes')} ({getTrendValue('Against the Spread Trends', 'dogs', 'percentage')}%)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Over vs Under Trends</h4>
          <ul>
            <li>All Games: {getTrendValue('Over vs Under Trends', 'all_games', 'overs')}-{getTrendValue('Over vs Under Trends', 'all_games', 'unders')} (Over: {getTrendValue('Over vs Under Trends', 'all_games', 'percentage')}%)</li>
            <li>Non-Overtime Games: {getTrendValue('Over vs Under Trends', 'non_overtime_games', 'overs')}-{getTrendValue('Over vs Under Trends', 'non_overtime_games', 'unders')} (Over: {getTrendValue('Over vs Under Trends', 'non_overtime_games', 'percentage')}%)</li>
            <li>Overtime Games: {getTrendValue('Over vs Under Trends', 'overtime_games', 'overs')} (Over: {getTrendValue('Over vs Under Trends', 'overtime_games', 'percentage')}%)</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;