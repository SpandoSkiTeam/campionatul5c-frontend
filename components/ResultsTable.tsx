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
        {row.runTimeRun1 ? row.runTimeRun1 : row.statusRun1.text}
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
        {row.runTimeRun2 ? row.runTimeRun2 : row.statusRun2.text}
      </span>
    </div>
  );
};

const processRows = (runs) => {
  const racerData = {};

  runs.forEach((run, index) => {
    if (!racerData[run.racerId]) {
      racerData[run.racerId] = {
        id: index,
        racerId: run.racerId,
        racerNumber: run.racerNumber,
        racerName: run.racer.lastName.trim() + " " + run.racer.firstName.trim(),
        category: run.racer.category,
        statusRun1: run.runNumber === 1 ? mapRunStatus(run.status) : "N/A",
        statusRun2: run.runNumber === 2 ? mapRunStatus(run.status) : "N/A",
        runTimeRun1: run.runNumber === 1 ? run.runTime : null,
        runTimeRun2: run.runNumber === 2 ? run.runTime : null,
      };
    } else {
      if (run.runNumber === 1) {
        racerData[run.racerId].statusRun1 = mapRunStatus(run.status);
        racerData[run.racerId].runTimeRun1 = run.runTime;
      } else if (run.runNumber === 2) {
        racerData[run.racerId].statusRun2 = mapRunStatus(run.status);
        racerData[run.racerId].runTimeRun2 = run.runTime;
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
