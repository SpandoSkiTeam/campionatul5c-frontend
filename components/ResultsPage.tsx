"use client";
// components/Form.tsx
import React, { useEffect, useRef, useState } from "react";
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
  IconButton,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { Helmet } from "react-helmet";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import ChampionshipResults from "./ChampionshipResults";
import { ageGroups, baseUrl } from "@/app/utils/constants";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  enqueueErrorSnackbar,
  enqueueInfoSnackbar,
  enqueueSuccessSnackbar,
  enqueueWarningSnackbar,
} from "./Snackbar";
import { mapRunStatus } from "@/app/utils/utils";

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

const ResultsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [races, setRaces] = useState<any>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const currentRace = 3;
  const [selectedRace, setSetSelectedRace] = useState(currentRace);
  const [displayChampionshipResults, setDisplayChampionshipResults] =
    useState(false);
  const [isReceivingLiveMessages, setIsReceivingLiveMessages] =
    useState<boolean>(false);
  const racesRef = useRef(races);

  useEffect(() => {
    racesRef.current = races;
  }, [races]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/notificationhub`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)

      .build();

    connection
      .start()
      .then(function () {
        console.log("SignalR connected!");
        setIsReceivingLiveMessages(true);
        enqueueSuccessSnackbar(
          "Conectat",
          "Rezultatele live sunt acum disponibile. modificarile vor apărea automat în pagină."
        );
      })
      .catch(function (err) {
        setIsReceivingLiveMessages(false);
        enqueueErrorSnackbar(
          "Eroare de conectare",
          "Sistemul de rezultate live nu este disponibil. Folosiți butonul de refresh din parte dreaptă jos a paginii."
        );
        return console.error(err.toString());
      });

    const handleRaceRunUpdate = (message) => {
      const updatedRuns = JSON.parse(message);
      let validationSnackbarMessage = "";
      const newRaces = racesRef.current.map((race) => {
        // Map through each race's runs and update them if they match the updated ones
        const updatedRaceRuns = race.runs.map((run) => {
          const updateForRun = updatedRuns.find(
            (update) =>
              update.id === run.id &&
              (update.status !== run.status || update.runTime !== run.runTime)
          );
          if (updateForRun) {
            switch (updateForRun.status) {
              case 0:
                validationSnackbarMessage = `Participantul ${
                  run.racer.lastName
                } ${run.racer.firstName} este acum ${
                  mapRunStatus(updateForRun.status).text
                }`;
                break;
              case 1:
                enqueueWarningSnackbar(
                  "Modificare de cursă",
                  `Participantul ${run.racer.lastName} ${
                    run.racer.firstName
                  } este acum ${mapRunStatus(updateForRun.status).text}`
                );
                break;
              case 2:
                enqueueSuccessSnackbar(
                  "Modificare de cursă",
                  `Participantul ${run.racer.lastName} ${
                    run.racer.firstName
                  } este acum ${
                    mapRunStatus(updateForRun.status).text
                  } în manșa ${
                    updateForRun.runNumber
                  } cu timpul ${updateForRun.runTime.substring(
                    3,
                    updateForRun.runTime.length - 4
                  )}`
                );
                break;
              case 3:
                enqueueErrorSnackbar(
                  "Modificare de cursă",
                  `Participantul ${run.racer.lastName} ${
                    run.racer.firstName
                  } este acum ${mapRunStatus(updateForRun.status).text}`
                );
                break;
              case 4:
                validationSnackbarMessage = `Participantul ${
                  run.racer.lastName
                } ${run.racer.firstName}  este acum ${
                  mapRunStatus(updateForRun.status).text
                }`;
                break;
            }
          }
          return updateForRun ? { ...run, ...updateForRun } : run;
        });
        // Return the race with its updated runs
        return { ...race, runs: updatedRaceRuns };
      });
      setRaces(newRaces);
      if (validationSnackbarMessage !== "")
        enqueueInfoSnackbar(
          "Modificare de validare",
          validationSnackbarMessage
        );
    };

    connection.on("updated_race_runs", handleRaceRunUpdate);

    return () => {
      connection.off("updated_race_runs", handleRaceRunUpdate);
    };
  }, []);

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

  const handleLoadData = async (raceId) => {
    setIsLoading(true);
    await axios.post(baseUrl + "/Racer/LoadRacersForAllRaces");
    //await axios.post(baseUrl + `/RaceManagement/GenerateRaceNumbers/${raceId}`);
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsFetchingData(true);
    try {
      const response = await axios.get(baseUrl + "/Race");
      setRaces(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      enqueueErrorSnackbar(
        "Eroare de sistem",
        "A apărut o eroare la încărcarea datelor. Reîncărcați pagina"
      );
      // Handle the error as needed
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const query = new URLSearchParams(window.location.search);
    const initialTab = parseInt(query.get("tab") || "", 10);
    setSetSelectedRace(isNaN(initialTab) ? currentRace : initialTab);
    const handlePopState = (event) => {
      const query = new URLSearchParams(window.location.search);
      const tab = parseInt(query.get("tab") || "", 10);
      if (!isNaN(tab)) {
        setSetSelectedRace(tab);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      {!isReceivingLiveMessages && (
        <Box
          sx={{
            position: "fixed",
            bottom: 14,
            right: 14,
            zIndex: 1000,
            background: "white",
            borderColor: "#14204f",
            borderWidth: "1px",
            borderRadius: "8px",
            borderStyle: "solid",
          }}
        >
          <IconButton
            onClick={fetchData}
            sx={{
              animation: isFetchingData ? "spin 1s linear infinite" : "none",
            }}
          >
            <RefreshIcon
              style={{
                borderColor: "#14204f",
                color: "#14204f",
              }}
            />
          </IconButton>
        </Box>
      )}

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
        {!displayChampionshipResults && (
          <ImageMenu
            races={races}
            onRaceSelect={handleRaceSelect}
            selectedRace={selectedRace}
          />
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => setDisplayChampionshipResults((prev) => !prev)}
          >
            {displayChampionshipResults
              ? "Rezultate curse"
              : "Rezultate campionat"}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2, // Adjust the gap as needed
            mb: 2,
            width: "95%",
            margin: "auto",
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

        <Box>
          {displayChampionshipResults ? (
            <ChampionshipResults
              selectedAgeGroup={selectedAgeGroup}
              searchFilter={searchFilter.toLowerCase()}
            />
          ) : (
            <Box>
              {races.map((race: any, index) => (
                <TabPanel value={selectedRace} index={index} key={index}>
                  <Box
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                      display: "flex",
                      flexDirection: "row",
                      color: "#7eb7e3",
                    }}
                  >
                    <Helmet>
                      <title>5C- Rezultate Curse</title>
                    </Helmet>
                    <WarningIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.3rem" },
                      }}
                    />
                    <Box
                      style={{
                        marginBottom: "3px",
                        fontFamily: "arial",
                      }}
                    >
                      Rezultatele afișate în timpul cursei sunt neoficiale.
                    </Box>
                  </Box>
                  <ResultsTable
                    runs={race.runs}
                    raceId={race.id}
                    selectedAgeGroup={selectedAgeGroup}
                    searchFilter={searchFilter}
                  />
                </TabPanel>
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            textAlign: "center",
            fontSize: "0.7rem",
            fontFamily: "arial",
            marginTop: "24px",
            marginBottom: "8px",
            color: "gray", // Set the color to light gray
          }}
        >
          <IconButton
            onClick={handleLoadData}
            sx={{
              animation: isLoading ? "spin 1s linear infinite" : "none",
              marginRight: "8px",
            }}
          >
            <RefreshIcon />
          </IconButton>
          Developed by{" "}
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
            Radu Matei Bîrle.
          </a>
          Designed by{" "}
          <a
            href="https://www.linkedin.com/in/andrei-stetcu-44340588/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }} // Inherit the color from parent
          >
            Andrei Ștețcu
          </a>
          .
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsPage;
