import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const mapRunStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Registered";
    case 1:
      return "InProgress";
    case 2:
      return "Finished";
    case 3:
      return "Disqualified";
    default:
      return "Unknown Status";
  }
};

// Assuming each run object has a structure like the ones you provided
const processRows = (runs) => {
  const racerData = {};

  runs.forEach((run) => {
    if (!racerData[run.raceId]) {
      racerData[run.raceId] = {
        id: run.racerNumber,
        racerNumber: run.racerNumber,
        statusRun1: run.runNumber === 1 ? mapRunStatus(run.status) : "N/A",
        statusRun2: run.runNumber === 2 ? mapRunStatus(run.status) : "N/A",
        runTimeRun1: run.runNumber === 1 ? run.runTime : null,
        runTimeRun2: run.runNumber === 2 ? run.runTime : null,
      };
    } else {
      if (run.runNumber === 1) {
        racerData[run.raceId].statusRun1 = mapRunStatus(run.status);
        racerData[run.raceId].runTimeRun1 = run.runTime;
      } else if (run.runNumber === 2) {
        racerData[run.raceId].statusRun2 = mapRunStatus(run.status);
        racerData[run.raceId].runTimeRun2 = run.runTime;
      }
    }
  });

  return Object.values(racerData);
};

const ResultsTable = (props) => {
  const columns = [
    { field: "racerNumber", headerName: "Number", width: 80 },
    { field: "statusRun1", headerName: "Status Run 1", width: 150 },
    { field: "statusRun2", headerName: "Status Run 2", width: 150 },
    { field: "runTimeRun1", headerName: "Run Time 1", width: 150 },
    { field: "runTimeRun2", headerName: "Run Time 2", width: 150 },
    // ... other columns if needed
  ];

  const rows: any = processRows(props.runs);

  return (
    <div style={{ height: 400, width: "100%", background: "white" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default ResultsTable;
