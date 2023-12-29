import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const mapRunStatus = (status: number) => {
  switch (status) {
    case 0:
      return { text: "Înscris", color: "gray" };
    case 1:
      return { text: "În coborâre", color: "blue" };
    case 2:
      return { text: "Finalizat", color: "green" };
    case 3:
      return { text: "Descalificat", color: "red" };
    default:
      return { text: "Status Necunoscut", color: "black" };
  }
};
const renderStatusCell = (params) => (
  <span style={{ color: params.value.color }}>{params.value.text}</span>
);

const processRows = (runs) => {
  const racerData = {};

  runs.forEach((run) => {
    if (!racerData[run.racerId]) {
      racerData[run.racerId] = {
        id: run.racerNumber,
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
  const columns = [
    { field: "racerNumber", headerName: "Numar", width: 100, minWidth: 80 },
    { field: "racerName", headerName: "Nume", flex: 1, minWidth: 200 },
    { field: "category", headerName: "Categorie", width: 150, minWidth: 120 },
    {
      field: "statusRun1",
      headerName: "Status Run 1",
      width: 150,
      renderCell: renderStatusCell,
    },
    {
      field: "statusRun2",
      headerName: "Status Run 2",
      width: 150,
      renderCell: renderStatusCell,
    },
    { field: "runTimeRun1", headerName: "Run Time 1", width: 150 },
    { field: "runTimeRun2", headerName: "Run Time 2", width: 150 },
    // ... other columns if needed
  ];

  const rows: any = processRows(props.runs);

  return (
    <div
      style={{
        height: 600,
        width: "100%",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "20px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ "& .MuiDataGrid-cell": { minWidth: 80 } }}
      />
    </div>
  );
};

export default ResultsTable;
