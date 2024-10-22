import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import OffenseComparisonChart from './OffenseComparisonChart';
import DefenseComparisonChart from './DefenseComparisonChart';
import { HashRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';


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
          const content = JSON.parse(item.fields.Content);
          acc[category] = content;
          
          // If this is the trends data, parse it separately
          if (category === 'trends') {
            acc.trendsData = JSON.parse(content);
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
  
  const matchups = data.matchup && data.matchup["Trending Bets for Week"] ? data.matchup["Trending Bets for Week"] : [];
  const fantasy = data.fantasy || {};

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Fantasy Picks</h2>
      
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
      </div>

      <h2 className="text-2xl font-semibold mb-4">All Matchups</h2>
      {matchups.length > 0 ? (
        matchups.map((bet, index) => (
        <Link key={index} to={`/matchup/${generateSlug(bet.matchup)}`} className="block mb-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700">
          <h3 className="text-xl font-bold">{bet.matchup}</h3>
          <p>{bet.betting_insight}</p>
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
  const matchups = data.matchup && data.matchup["Trending Bets for Week"] ? data.matchup["Trending Bets for Week"] : [];
  const matchup = matchups.find(m => generateSlug(m.matchup) === slug);
  const vegasData = data.vegas ? data.vegas.find(game => game.game === matchup?.matchup) : null;
  const trendsData = data.trends;
  const teamStats = data.teamStats;
  const teamStats2 = data.teamStats2;

  if (!matchup || !trendsData || !teamStats || !teamStats2) {
    return <div>Matchup, trends data, or team stats not found</div>;
  }

  const [team1, team2] = matchup.matchup.split(' vs. ');

  return (
    <div>
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">&larr; Back to Overview</Link>
      <h2 className="text-2xl font-semibold mb-4">{matchup.matchup}</h2>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Offensive Comparison</h3>
        <OffenseComparisonChart teamStats={teamStats} team1={team1} team2={team2} />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Defensive Comparison</h3>
        <DefenseComparisonChart teamStats={teamStats2} team1={team1} team2={team2} />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Betting Insight</h3>
        <p>{matchup.betting_insight}</p>
      </div>

      {vegasData && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-2">📌 Vegas Odds</h3>
          <p>Current Spread: {vegasData.current_spread}</p>
          <p>Recent Changes: {vegasData.recent_changes}</p>
          <p>Betting Shift: {vegasData.betting_shift}</p>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">📌 Season-to-date Trends</h3>        
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Straight Up Trends</h4>
          <ul>
            <li>Away Teams: {trendsData["Straight Up Trends"].overall_performance.away_teams.wins}-{trendsData["Straight Up Trends"].overall_performance.away_teams.losses} ({trendsData["Straight Up Trends"].overall_performance.away_teams.percentage}%)</li>
            <li>Home Teams: {trendsData["Straight Up Trends"].overall_performance.home_teams.wins}-{trendsData["Straight Up Trends"].overall_performance.home_teams.losses} ({trendsData["Straight Up Trends"].overall_performance.home_teams.percentage}%)</li>
            <li>Favorites: {trendsData["Straight Up Trends"].overall_performance.favorites.wins}-{trendsData["Straight Up Trends"].overall_performance.favorites.losses} ({trendsData["Straight Up Trends"].overall_performance.favorites.percentage}%)</li>
            <li>Underdogs: {trendsData["Straight Up Trends"].overall_performance.dogs.wins}-{trendsData["Straight Up Trends"].overall_performance.dogs.losses} ({trendsData["Straight Up Trends"].overall_performance.dogs.percentage}%)</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold">Against the Spread Trends</h4>
          <ul>
            <li>Away Teams: {trendsData["Against the Spread Trends"].overall_performance.away_teams.wins}-{trendsData["Against the Spread Trends"].overall_performance.away_teams.losses}-{trendsData["Against the Spread Trends"].overall_performance.away_teams.pushes} ({trendsData["Against the Spread Trends"].overall_performance.away_teams.percentage}%)</li>
            <li>Home Teams: {trendsData["Against the Spread Trends"].overall_performance.home_teams.wins}-{trendsData["Against the Spread Trends"].overall_performance.home_teams.losses}-{trendsData["Against the Spread Trends"].overall_performance.home_teams.pushes} ({trendsData["Against the Spread Trends"].overall_performance.home_teams.percentage}%)</li>
            <li>Favorites: {trendsData["Against the Spread Trends"].overall_performance.favorites.wins}-{trendsData["Against the Spread Trends"].overall_performance.favorites.losses}-{trendsData["Against the Spread Trends"].overall_performance.favorites.pushes} ({trendsData["Against the Spread Trends"].overall_performance.favorites.percentage}%)</li>
            <li>Underdogs: {trendsData["Against the Spread Trends"].overall_performance.dogs.wins}-{trendsData["Against the Spread Trends"].overall_performance.dogs.losses}-{trendsData["Against the Spread Trends"].overall_performance.dogs.pushes} ({trendsData["Against the Spread Trends"].overall_performance.dogs.percentage}%)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Over vs Under Trends</h4>
          <ul>
            <li>All Games: {trendsData["Over vs Under Trends"].overall_performance.all_games.overs}-{trendsData["Over vs Under Trends"].overall_performance.all_games.unders} (Over: {trendsData["Over vs Under Trends"].overall_performance.all_games.percentage.overs}%)</li>
            <li>Non-Overtime Games: {trendsData["Over vs Under Trends"].overall_performance.non_overtime_games.overs}-{trendsData["Over vs Under Trends"].overall_performance.non_overtime_games.unders} (Over: {trendsData["Over vs Under Trends"].overall_performance.non_overtime_games.percentage.overs}%)</li>
            <li>Overtime Games: {trendsData["Over vs Under Trends"].overall_performance.overtime_games.overs} (Over: {trendsData["Over vs Under Trends"].overall_performance.overtime_games.percentage}%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;