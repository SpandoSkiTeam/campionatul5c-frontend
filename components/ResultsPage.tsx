"use client";
// components/Form.tsx
import React, { useEffect, useState } from "react";
import ResultsTable from "./ResultsTable";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const ImageMenu = ({ races, onRaceSelect, selectedRace }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {races.map((race, index) => (
        <Button
          key={index}
          onClick={(e) => onRaceSelect(e, index)}
          className="button-hover-effect"
          style={{ margin: "0px" }}
        >
          <img
            src={race.raceLogo}
            alt={race.raceName}
            style={{
              height: "72px",
              borderRadius: "8px",
              filter: selectedRace === index ? "none" : "grayscale(90%)",
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

const ageGroups = [
  "Toate",
  "Girls 6 and Under",
  "Boys 6 and Under",
  "Girls 7-8",
  "Boys 7-8",
  "Girls 9-10",
  "Boys 9-10",
  "Girls 11-12",
  "Boys 11-12",
  "Girls 13-14",
  "Boys 13-14",
  "Girls 15-16",
  "Boys 15-16",
  "Open Women",
  "Open Men",
];

const baseUrl = "https://api.campionatul5c.ro";
const ResultsPage: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [races, setRaces] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedRace, setSetSelectedRace] = useState(0);

  const handleAgeGroupChange = (event) => {
    setSelectedAgeGroup(event.target.value);
  };

  const handleRaceSelect = (event, newValue) => {
    const newUrl = `${window.location.pathname}?tab=${newValue}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    setSetSelectedRace(newValue);
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl + "/Race");
        setRaces(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed
      }
    };

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch every 5 seconds
    }, 5000);
    const query = new URLSearchParams(window.location.search);
    const initialTab = parseInt(query.get("tab") || "", 10);
    setSetSelectedRace(isNaN(initialTab) ? 0 : initialTab);
    const handlePopState = (event) => {
      const query = new URLSearchParams(window.location.search);
      const tab = parseInt(query.get("tab") || "", 10);
      if (!isNaN(tab)) {
        setSetSelectedRace(tab);
      }
      return () => clearInterval(interval);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      <Paper
        sx={{
          backgroundColor: "rgba(255,255,255)",
          width: { xs: "100%", sm: "90%", md: "85%" },
          margin: "auto",
          marginTop: "16px",
          marginBottom: "16px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            fontSize: { xs: "2.5rem", sm: "2rem", md: "3rem" },
            marginTop: "24px",
            fontFamily: "Clab-Black",
            color: "#14204f",
          }}
        >
          Campionatul 5C
        </Box>
        <ImageMenu
          races={races}
          onRaceSelect={handleRaceSelect}
          selectedRace={selectedRace}
        />
        {races.map((race: any, index) => (
          <TabPanel value={selectedRace} index={index} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 2, // Adjust the gap as needed
                mb: 2,
                width: "100%",
              }}
            >
              <FormControl sx={{ width: "100%", maxWidth: "400px" }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={selectedAgeGroup}
                  label="Categoria"
                  onChange={handleAgeGroupChange}
                >
                  {ageGroups.map((ageGroup, index) => (
                    <MenuItem key={index} value={ageGroup}>
                      {ageGroup}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                sx={{ width: "100%", maxWidth: "400px" }}
                label="Caută după nume"
                variant="outlined"
                value={searchFilter}
                onChange={handleSearchFilterChange}
              />
            </Box>
            <ResultsTable
              runs={race.runs
                .filter((r) =>
                  selectedAgeGroup !== "" && selectedAgeGroup !== "Toate"
                    ? r.racer.category === selectedAgeGroup
                    : true
                )
                .filter((r) =>
                  (r.racer.lastName + " " + r.racer.firstName)
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase())
                )}
              raceId={race.id}
            />
          </TabPanel>
        ))}
        <Box
          sx={{
            textAlign: "center",
            fontSize: "0.7rem",
            marginTop: "24px",
            marginBottom: "8px",
            color: "gray", // Set the color to light gray
          }}
        >
          Designed by{" "}
          <a
            href="https://www.linkedin.com/in/andrei-stetcu-44340588/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }} // Inherit the color from parent
          >
            Andrei Ștețcu
          </a>
          . Developed by{" "}
          <a
            href="https://www.linkedin.com/in/andrei-tudorica-661a22b9/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            Andrei Tudorică
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/radu-matei-birle/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            Radu Matei Bîrle
          </a>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsPage;
