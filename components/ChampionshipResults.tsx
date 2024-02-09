import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { baseUrl } from "@/app/utils/constants";
import { Helmet } from "react-helmet";
import Messages from "./messages";

const ChampionshipResults = ({ selectedAgeGroup, searchFilter }) => {
  const [displayResults, setDisplayResults] = useState<readonly any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Race/GetChampionshipResults`
        );
        const results = response.data;

        const filteredResults = results
          .filter((racer: any) => racer.points > 0)
          .filter(
            (racer: any) =>
              selectedAgeGroup === "" ||
              selectedAgeGroup === "Toate" ||
              racer.category === selectedAgeGroup
          )
          .filter(
            (racer: any) =>
              searchFilter === "" ||
              racer.racerName.toLowerCase().includes(searchFilter)
          )
          .sort((a: any, b: any) => b.points - a.points);

        setDisplayResults(filteredResults);
      } catch (error) {
        console.error("Error fetching championship results", error);
        // Handle the error appropriately
      }
    };

    fetchResults();
  }, [selectedAgeGroup, searchFilter]);

  const columns = [
    { field: "rankInCategory", headerName: "#", width: 100 },
    { field: "racerName", headerName: "Nume", width: 200 },
    { field: "points", headerName: "Total Puncte", width: 130 },
    { field: "category", headerName: "Categorie", width: 150 },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 600,
        width: "95%",
        margin: "auto",
        marginTop: "20px",
      }}
    >
      <Helmet>
        <title>5C- Rezultate Campionat</title>
      </Helmet>
      <DataGrid
        rows={displayResults}
        columns={columns}
        getRowId={(row: any) => row.racerId}
      />
    </div>
  );
};

export default ChampionshipResults;
