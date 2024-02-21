import React, { useEffect, useState } from "react";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { Icon } from "@mui/material";
import axios from "axios";
import {
  calculatePoints,
  getTotalTime,
  mapRunStatus,
  timeStringToMilliseconds,
} from "@/app/utils/utils";
import { baseUrl } from "@/app/utils/constants";

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
      {row.totalTime && row.totalTime != "N/A" && <Icon>{"check_circle"}</Icon>}
      <span style={{ marginLeft: 8 }}>{row.totalTime || ""}</span>
    </div>
  );
};

const renderParentalAgreementCell = (params: GridCellParams) => {
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
      {row.racerParentalAgreement && <Icon>{"check_circle"}</Icon>}
    </div>
  );
};

const runTimeComparator = (v1, v2, cellParams1, cellParams2) => {
  const time1 = cellParams1?.value;
  const time2 = cellParams2?.value;

  // If both times are present, compare them
  if (time1 && time2) {
    return timeStringToMilliseconds(time1) - timeStringToMilliseconds(time2);
  }

  // Handle cases where one or both times are missing
  if (!time1) return 1; // Sort nulls to the end
  if (!time2) return -1; // Sort nulls to the end
  return 0;
};

const processRows = (runs, selectedAgeGroup, searchFilter) => {
  const racerData = {};
  runs.forEach((run, index) => {
    if (!racerData[run.racerId]) {
      racerData[run.racerId] = {
        id: index,
        racerId: run.racerId,
        racerNumber: run.racerNumber,
        racerName: run.racer.lastName.trim() + " " + run.racer.firstName.trim(),
        racerParentalAgreement: run.racer.parentalAgreementSigned,
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
        if (racerData)
          racerData[run.racerId].totalTime = getTotalTime(
            racerData[run.racerId].runTimeRun1,
            racerData[run.racerId].runTimeRun2
          );
      } else {
        racerData[run.racerId].totalTime = "N/A";
      }
    }
  });

  const categories: any = Object.values(racerData).reduce(
    (acc: any, racer: any) => {
      const category = racer.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      if (
        racer.statusRun1.text === "Finalizat" &&
        racer.statusRun2.text === "Finalizat"
      )
        acc[category].push(racer);
      return acc;
    },
    {}
  );

  Object.keys(categories).forEach((category) => {
    // Sort racers by total time within each category
    categories[category].sort((a, b) => {
      return (
        timeStringToMilliseconds(a.totalTime) -
        timeStringToMilliseconds(b.totalTime)
      ); // Assuming totalTime is a number, adjust if it's a different format
    });

    // Assign points based on position
    categories[category].forEach((racer, index) => {
      racer.accumulatedPoints = calculatePoints(index + 1);
    });
  });

  return Object.values(racerData)
    .filter((r: any) =>
      selectedAgeGroup !== "" && selectedAgeGroup !== "Toate"
        ? selectedAgeGroup.includes(r.category)
        : true
    )
    .filter((r: any) =>
      r.racerName.toLowerCase().includes(searchFilter.toLowerCase())
    )
    .sort((a, b) => {
      // Check if totalTime is "N/A", convert to a high value for sorting
      let timeA =
        a.totalTime === "N/A" ? Number.MAX_VALUE : parseFloat(a.totalTime);
      let timeB =
        b.totalTime === "N/A" ? Number.MAX_VALUE : parseFloat(b.totalTime);

      if (timeA !== timeB) return timeA - timeB; // Sort by totalTime if not equal

      // If totalTime is equal or "N/A", sort by racerNumber
      return a.racerNumber - b.racerNumber;
    });
};

const ResultsTable = ({ runs, raceId, selectedAgeGroup, searchFilter }) => {
  const [selectedRacer, setSelectedRacer] = useState<any>(null);
  const [sortModel, setSortModel] = useState<any>([
    { field: "totalTime", sort: "asc" },
  ]);

  const handleSortModelChange = (model) => {
    if (model.length > 1) {
      // Keep only the last sorted column
      const lastSorted = model[model.length - 1];
      setSortModel([lastSorted]);
    } else {
      setSortModel(model);
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (selectedRacer) {
        if (event.key === "v") {
          await axios.get(
            `${baseUrl}/Racer/ToggleRacerValidation/${selectedRacer.racerId}/${raceId}`
          );
        } else if (event.key === "i") {
          // Call the function for 'i'
          await axios.get(
            `${baseUrl}/Racer/ToggleRacerValidation/${selectedRacer.racerId}/${raceId}`
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
      field: "runTimeRun1",
      headerName: "Run 1",
      width: 150,
      renderCell: renderRun1Cell,
      sortable: true,
      sortComparator: runTimeComparator,
    },
    {
      field: "runTimeRun2",
      headerName: "Run 2",
      width: 150,
      renderCell: renderRun2Cell,
      sortable: true,
      sortComparator: runTimeComparator,
    },
    {
      field: "totalTime",
      headerName: "Total Time",
      width: 150,
      renderCell: renderTotalTimeCell,
    },
    { field: "category", headerName: "Categorie", width: 150, minWidth: 120 },
    {
      field: "accumulatedPoints",
      headerName: "Puncte",
      width: 150,
      valueGetter: (params) => params.row.accumulatedPoints || 0,
    },
    {
      field: "racerParentalAgreement",
      headerName: "AP",
      width: 60,
      renderCell: renderParentalAgreementCell,
    },
  ];

  const rows: any = processRows(runs, selectedAgeGroup, searchFilter);

  return (
    <div
      style={{
        height: 600,
        width: "100%",
        background: "rgba(255, 255, 255)",
        borderRadius: "20px",
        marginTop: "3px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ "& .MuiDataGrid-cell": { minWidth: 80 } }}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRacer ? [selectedRacer.id] : []}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
      />
    </div>
  );
};

export default ResultsTable;
