import React, { useEffect, useState } from "react";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { Icon } from "@mui/material";
import axios from "axios";

const mapRunStatus = (status: number) => {
  switch (status) {
    case 0:
      return { text: "Înscris", color: "gray", iconName: "assignment" };
    case 1:
      return {
        text: "În coborâre",
        color: "orange",
        iconName: "trending_down",
      };
    case 2:
      return { text: "Finalizat", color: "green", iconName: "check_circle" };
    case 3:
      return { text: "Descalificat", color: "red", iconName: "cancel" };
    case 4:
      return { text: "Validat", color: "blue", iconName: "verified" };
    case 5:
      return { text: "Neîncheiat", color: "purple", iconName: "pause" };
    default:
      return { text: "Status Necunoscut", color: "black", iconName: "help" };
  }
};

const renderRun1Cell = (params: GridCellParams) => {
  const row = params.row;
  return (
    <div
      style={{
        color: row.statusRun1.color,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Icon>{row.statusRun1.iconName}</Icon>
      <span style={{ marginLeft: 8 }}>
        {row.runTimeRun1 && row.statusRun1.text === "Finalizat"
          ? row.runTimeRun1
          : row.statusRun1.text}
      </span>
    </div>
  );
};

const renderRun2Cell = (params: GridCellParams) => {
  // Similar implementation for Run 2
  const row = params.row;
  return (
    <div
      style={{
        color: row.statusRun2.color,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Icon>{row.statusRun2.iconName}</Icon>
      <span style={{ marginLeft: 8 }}>
        {row.runTimeRun2 && row.statusRun2.text === "Finalizat"
          ? row.runTimeRun2
          : row.statusRun2.text}
      </span>
    </div>
  );
};

const renderTotalTimeCell = (params: GridCellParams) => {
  // Similar implementation for Run 2
  const row = params.row;
  return (
    <div
      style={{
        color: "green",
        display: "flex",
        alignItems: "center",
      }}
    >
      {row.totalTime && <Icon>{"check_circle"}</Icon>}
      <span style={{ marginLeft: 8 }}>{row.totalTime || ""}</span>
    </div>
  );
};

const getTotalTime = (time1, time2) => {
  // Convert time strings to milliseconds
  const toMilliseconds = (time) => {
    if (!time || time.trim() === "") return 0;
    const [minutes, seconds] = time.split(":").map(Number);
    const [sec, milli = 0] = seconds.toString().split(".").map(Number);
    return (minutes * 60 + sec) * 1000 + milli;
  };

  // Add the times in milliseconds
  const totalMilliseconds = toMilliseconds(time1) + toMilliseconds(time2);

  // Convert total milliseconds back to the time format
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = totalMilliseconds % 1000;

  return `${minutes}:${seconds}.${milliseconds.toString().padStart(3, "0")}`;
};

const processRows = (runs) => {
  const racerData = {};

  runs.forEach((run, index) => {
    console.log(run.runTime);
    if (!racerData[run.racerId]) {
      racerData[run.racerId] = {
        id: index,
        racerId: run.racerId,
        racerNumber: run.racerNumber,
        racerName: run.racer.lastName.trim() + " " + run.racer.firstName.trim(),
        category: run.racer.category,
        statusRun1: run.runNumber === 1 ? mapRunStatus(run.status) : "N/A",
        statusRun2: run.runNumber === 2 ? mapRunStatus(run.status) : "N/A",
        runTimeRun1:
          run.runNumber === 1 && run.runTime
            ? run.runTime.substring(3, run.runTime.length - 4)
            : null,
        runTimeRun2:
          run.runNumber === 2 && run.runTime
            ? run.runTime.substring(3, run.runTime.length - 4)
            : null,
        totalTime: null,
      };
    } else {
      if (run.runNumber === 1) {
        racerData[run.racerId].statusRun1 = mapRunStatus(run.status);
        racerData[run.racerId].runTimeRun1 = run.runTime
          ? run.runTime.substring(3, run.runTime.length - 4)
          : null;
      } else if (run.runNumber === 2) {
        racerData[run.racerId].statusRun2 = mapRunStatus(run.status);
        racerData[run.racerId].runTimeRun2 = run.runTime
          ? run.runTime.substring(3, run.runTime.length - 4)
          : null;
      }
      if (
        racerData[run.racerId].statusRun1.text === "Finalizat" &&
        racerData[run.racerId].statusRun2.text === "Finalizat"
      ) {
        racerData[run.racerId].totalTime = getTotalTime(
          racerData[run.racerId].runTimeRun1,
          racerData[run.racerId].runTimeRun2
        );
      }
    }
  });

  return Object.values(racerData);
};

const ResultsTable = (props) => {
  const [selectedRacer, setSelectedRacer] = useState<any>(null);

  const baseUrl = "https://api.campionatul5c.ro";
  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (selectedRacer) {
        if (event.key === "v") {
          await axios.get(
            `${baseUrl}/Racer/ToggleRacerValidation/${selectedRacer.racerNumber}/${props.raceId}`
          );
          console.log("Pressed 'v' for racer:", selectedRacer);
        } else if (event.key === "i") {
          // Call the function for 'i'
          await axios.get(
            `${baseUrl}/Racer/ToggleRacerValidation/${selectedRacer.racerNumber}/${props.raceId}`
          );
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedRacer]);

  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedId = selectionModel[0]; // Assuming single selection
      const racer = rows.find((row) => row.id === selectedId);
      setSelectedRacer(racer);
    } else {
      setSelectedRacer(null);
    }
  };

  const columns = [
    {
      field: "racerNumber",
      headerName: "#",
      width: 65,
      minWidth: 65,
    },
    {
      field: "racerName",
      headerName: "Nume",
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
    },
    {
      field: "statusRun1",
      headerName: "Run 1",
      width: 150,
      renderCell: renderRun1Cell,
    },
    {
      field: "statusRun2",
      headerName: "Run 2",
      width: 150,
      renderCell: renderRun2Cell,
    },
    {
      field: "totalTime",
      headerName: "Total Time",
      width: 150,
      renderCell: renderTotalTimeCell,
    },
    { field: "category", headerName: "Categorie", width: 150, minWidth: 120 },
  ];

  const rows: any = processRows(props.runs);

  return (
    <div
      style={{
        height: 600,
        width: "100%",
        background: "rgba(255, 255, 255)",
        borderRadius: "20px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ "& .MuiDataGrid-cell": { minWidth: 80 } }}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRacer ? [selectedRacer.id] : []}
      />
    </div>
  );
};

export default ResultsTable;
