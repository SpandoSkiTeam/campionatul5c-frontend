import React, { useState, useEffect } from "react";

const ChampionshipResults = ({ races }) => {
  const [championshipResults, setChampionshipResults] = useState([]);

  useEffect(() => {
    const calculatePoints = (position) => {
      switch (position) {
        case 1:
          return 100;
        case 2:
          return 80;
        case 3:
          return 60;
        case 4:
          return 40;
        case 5:
          return 20;
        default:
          return 10;
      }
    };

    const aggregatePoints = () => {
      let pointsMap = {};

      // Assuming races is an array of race results, each containing racerId and their position
      races.forEach((race, index) => {
        if (index < 3) {
          // Only consider first three races
          race.forEach(({ racerId, position }) => {
            if (!pointsMap[racerId]) {
              pointsMap[racerId] = {
                racerId,
                points: 0,
                racesParticipated: 0,
              };
            }
            pointsMap[racerId].points += calculatePoints(position);
            pointsMap[racerId].racesParticipated++;
          });
        }
      });

      // Filter out racers who didn't participate in all first three races and sort by points
      return Object.values(pointsMap)
        .filter((racer) => racer.racesParticipated === 3)
        .sort((a, b) => b.points - a.points);
    };

    setChampionshipResults(aggregatePoints());
  }, [races]);

  return (
    <div>
      <h2>Championship Results</h2>
      <ul>
        {championshipResults.map((result, index) => (
          <li
            key={index}
          >{`Racer ${result.racerId}: ${result.points} points`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChampionshipResults;
