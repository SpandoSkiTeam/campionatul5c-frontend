"use client";
// components/Form.tsx
import React, { useEffect, useState } from "react";
import ResultsTable from "./ResultsTable";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const ageGroups = [
  "All",
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

const baseUrl = "https://localhost:32770";
const ResultsPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [races, setRaces] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");

  const handleAgeGroupChange = (event) => {
    setSelectedAgeGroup(event.target.value);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl + "/Race");
        setRaces(response.data);
        console.log(response.data);
        // Handle the response data as needed
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      <Paper
        sx={{
          backgroundColor: "rgba(255,255,255, 0.5)",
          width: { xs: "100%", sm: "90%", md: "85%" },
          margin: "auto",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
          }}
        >
          Campionatul 5C
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="race tabs"
            sx={{
              ".MuiTabs-flexContainer": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {races.map((race: any, index) => (
              <Tab label={race.raceName} key={index} />
            ))}
          </Tabs>
        </Box>
        {races.map((race: any, index) => (
          <TabPanel value={value} index={index} key={index}>
            <FormControl
              sx={{
                width: "100%", // Full width on smaller screens
                maxWidth: 200, // Maximum width
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "5px",
                p: 1,
                mb: 2, // Add some margin at the bottom
              }}
            >
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedAgeGroup}
                label="Age Group"
                onChange={handleAgeGroupChange}
              >
                {ageGroups.map((ageGroup, index) => (
                  <MenuItem key={index} value={ageGroup}>
                    {ageGroup}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ResultsTable
              runs={
                selectedAgeGroup !== "All"
                  ? race.runs.filter(
                      (r) => r.racer.category === selectedAgeGroup
                    )
                  : race.runs
              }
            />
          </TabPanel>
        ))}
      </Paper>
    </Box>
  );
};

export default ResultsPage;
