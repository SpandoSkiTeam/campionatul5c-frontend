"use client";
// components/Form.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";

import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { downloadJson } from "@/app/utils/utils";
import PDFGenerator from "./PDFGenerator";

const inputGroupClass = "m-4 w-3/5 border-gray-500";
const labelClass = "block text-gray-700 text-md font-bold mb-2";
const inputClass =
  "shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const tableContainerClass = "w-full mx-auto my-4";

export interface FormValues {
  ageGroup: string;
  developmentArea: string;
  activityName: string;
  location: string;
  period: string;
  duration: string;
  numberOfParticipants: string;
  activityObjectives: string[];
  activityDescription: {
    symbolicFramework: string;
    description: string;
  };
  requiredMaterials: string;
  risks: any;
  evaluation: string;
  improvements: string;
}

const initialValues: FormValues = {
  ageGroup: "Temerari",
  developmentArea: "",
  activityName: "",
  location: "",
  period: "",
  duration: "",
  numberOfParticipants: "",
  activityObjectives: [""],
  activityDescription: {
    symbolicFramework: "",
    description: "",
  },
  requiredMaterials: "",
  risks: [
    {
      riskZone: "",
      activity: "",
      riskDescription: "",
      riskCircumstances: "",
      probability: "",
      impact: "",
      riskStrategy: "",
    },
  ],
  evaluation: "",
  improvements: "",
};

const validationSchema = Yup.object({
  ageGroup: Yup.string().required("Ramura de vârstă este obligatorie"),
  developmentArea: Yup.string().required("Aria de dezvoltare este obligatorie"),
  activityName: Yup.string().required("Denumirea activităţii este obligatorie"),
  location: Yup.string().required("Locul de desfăşurare este obligatoriu"),
  period: Yup.string().required("Perioada este obligatorie"),
  duration: Yup.string().required("Durata este obligatorie"),
  numberOfParticipants: Yup.string().required(
    "Nr. participanţi este obligatoriu"
  ),
  activityObjectives: Yup.array()
    .of(Yup.string())
    .test(
      "first-element-not-empty",
      "The first element cannot be empty",
      (array) => {
        return array && array.length > 0 ? array[0] !== "" : true;
      }
    ),
  activityDescription: Yup.object().shape({
    symbolicFramework: Yup.string(),
    description: Yup.string().required("Descrierea este obligatorie"),
  }),
  requiredMaterials: Yup.string(),
  evaluation: Yup.string().required("Evaluarea este obligatorie"),
});

const Form: React.FC = () => {
  const [renderPDF, setRenderPDF] = useState<boolean>(false);
  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e?.target?.result;
        try {
          const jsonData = JSON.parse(String(content));
          // Update Formik state here
          formik.setValues(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Handle errors here
        }
      };
      reader.readAsText(file);
    }
  };

  const addObjective = () => {
    const objectives = [...formik.values.activityObjectives, ""];
    formik.setFieldValue("activityObjectives", objectives);
  };

  const removeObjective = (index) => {
    const objectives = formik.values.activityObjectives.filter(
      (_, idx) => idx !== index
    );
    formik.setFieldValue("activityObjectives", objectives);
  };

  const updateObjective = (index, value) => {
    const objectives = formik.values.activityObjectives.map((objective, idx) =>
      idx === index ? value : objective
    );
    formik.setFieldValue("activityObjectives", objectives);
  };

  const addRiskRow = () => {
    const newRow = {
      riskZone: "",
      activity: "",
      riskDescription: "",
      riskCircumstances: "",
      probability: "",
      impact: "",
      riskStrategy: "",
    };
    formik.setFieldValue("risks", [...formik.values.risks, newRow]);
  };

  const removeRiskRow = (index) => {
    const updatedRows = formik.values.risks.filter((_, idx) => idx !== index);
    formik.setFieldValue("risks", updatedRows);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setRenderPDF(true);
      console.log("Form submitted with values:", values);
    },
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
        className="p-4 m-4 bg-white shadow-md rounded w-1/1 justify-center align-middle items-center"
      >
        <Input
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileSelected}
          style={{ display: "none" }} // Hide the default file input
          inputProps={{ accept: ".json" }}
        />
        <Button variant="outlined" color="primary" onClick={handleButtonClick}>
          Incarca o fisa veche JSON
        </Button>
        <br />
        <br />
        <br />

        <FormControl
          className={inputGroupClass}
          error={Boolean(formik.errors.ageGroup && formik.touched.ageGroup)}
        >
          <label className={labelClass}>Ramura de vârstă</label>
          <Select
            labelId="ageGroup-label"
            id="ageGroup"
            name="ageGroup"
            value={formik.values.ageGroup}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="Lupisori">Lupișori</MenuItem>
            <MenuItem value="Temerari">Temerari</MenuItem>
            <MenuItem value="Exploratori">Exploratori</MenuItem>
            <MenuItem value="Seniori">Seniori</MenuItem>
            <MenuItem value="Adulti">Adulți</MenuItem>
            <MenuItem value="Adulti">Mixt</MenuItem>
          </Select>
          {formik.errors.ageGroup && formik.touched.ageGroup && (
            <FormHelperText>{formik.errors.ageGroup}</FormHelperText>
          )}
        </FormControl>

        <label className={labelClass}>Aria de dezvoltare</label>
        <TextField
          fullWidth
          multiline
          id="developmentArea"
          name="developmentArea"
          type="text"
          value={formik.values.developmentArea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.developmentArea &&
            Boolean(formik.errors.developmentArea)
          }
          helperText={
            formik.touched.developmentArea && formik.errors.developmentArea
          }
          className={inputGroupClass}
        />

        {/* Denumirea activităţii */}

        <label className={labelClass}>Denumirea activităţii</label>
        <TextField
          fullWidth
          multiline
          id="activityName"
          name="activityName"
          type="text"
          value={formik.values.activityName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.activityName && Boolean(formik.errors.activityName)
          }
          helperText={formik.touched.activityName && formik.errors.activityName}
          className={inputGroupClass}
        />

        {/* Locul de desfăşurare */}

        <label className={labelClass}>Locul de desfăşurare</label>
        <TextField
          fullWidth
          multiline
          id="location"
          name="location"
          type="text"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
          className={inputGroupClass}
        />

        {/* Perioada */}

        <label className={labelClass}>Perioada</label>
        <TextField
          fullWidth
          multiline
          id="period"
          name="period"
          type="text"
          value={formik.values.period}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.period && Boolean(formik.errors.period)}
          helperText={formik.touched.period && formik.errors.period}
          className={inputGroupClass}
        />

        {/* Durata */}
        <label className={labelClass}>Durata</label>
        <TextField
          fullWidth
          multiline
          id="duration"
          name="duration"
          type="text"
          value={formik.values.duration}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.duration && Boolean(formik.errors.duration)}
          helperText={formik.touched.duration && formik.errors.duration}
          className={inputGroupClass}
        />

        {/* Nr. participanţi */}
        <label className={labelClass}>Nr. participanţi</label>
        <TextField
          fullWidth
          multiline
          id="numberOfParticipants"
          name="numberOfParticipants"
          type="text"
          value={formik.values.numberOfParticipants}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.numberOfParticipants &&
            Boolean(formik.errors.numberOfParticipants)
          }
          helperText={
            formik.touched.numberOfParticipants &&
            formik.errors.numberOfParticipants
          }
          className={inputGroupClass}
        />
        <FormControl
          className={inputGroupClass}
          error={Boolean(formik.errors.ageGroup && formik.touched.ageGroup)}
        >
          <label className={labelClass}>Obiectivele Activitatii</label>
          <List>
            {formik.values.activityObjectives.map((objective, index) => (
              <ListItem key={index}>
                <TextField
                  label={`Obiectivul ${index + 1}`}
                  type="text"
                  id={`objective${index}`}
                  name={`objective${index}`}
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.activityObjectives &&
                    Boolean(formik.errors.activityObjectives)
                  }
                  helperText={
                    formik.touched.activityObjectives &&
                    formik.errors.activityObjectives
                  }
                  fullWidth
                  variant="outlined"
                  className={inputClass}
                />
                {formik.values.activityObjectives.length > 1 && (
                  <IconButton
                    onClick={() => removeObjective(index)}
                    aria-label="delete"
                    color="warning"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
          <IconButton onClick={addObjective}>
            <AddCircleIcon color="primary" />
          </IconButton>
          {formik.errors.activityObjectives &&
            formik.touched.activityObjectives && (
              <FormHelperText>
                {formik.errors.activityObjectives}
              </FormHelperText>
            )}
        </FormControl>

        {/* Cadru simbolic */}
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Cadru simbolic"
          id="activityDescription.symbolicFramework"
          name="activityDescription.symbolicFramework"
          type="text"
          value={formik.values.activityDescription.symbolicFramework}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.activityDescription?.symbolicFramework &&
            Boolean(formik.errors.activityDescription?.symbolicFramework)
          }
          helperText={
            formik.touched.activityDescription?.symbolicFramework &&
            formik.errors.activityDescription?.symbolicFramework
          }
          className={inputGroupClass}
        />

        {/* Descriere */}

        <label className={labelClass}>Descriere</label>
        <TextField
          fullWidth
          multiline
          rows={2}
          id="activityDescription.description"
          name="activityDescription.description"
          type="text"
          value={formik.values.activityDescription.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.activityDescription?.description &&
            Boolean(formik.errors.activityDescription?.description)
          }
          helperText={
            formik.touched.activityDescription?.description &&
            formik.errors.activityDescription?.description
          }
          className={inputGroupClass}
        />

        {/* Materiale necesare */}
        <label className={labelClass}>Materiale necesare</label>
        <TextField
          fullWidth
          multiline
          rows={2}
          id="requiredMaterials"
          name="requiredMaterials"
          type="text"
          value={formik.values.requiredMaterials}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.requiredMaterials &&
            Boolean(formik.errors.requiredMaterials)
          }
          helperText={
            formik.touched.requiredMaterials && formik.errors.requiredMaterials
          }
          className={inputGroupClass}
        />

        <label className={labelClass}>Analiza riscurilor</label>
        <div className={tableContainerClass}>
          <TableContainer sx={{ alignItems: "center" }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" rowSpan={2}>
                    Zona de risc
                    <Tooltip title="AM NEVOIE DE CE SA SCRIU AICI PENTRU FIECARE COLOANA IN PARTE">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Activitate
                    <Tooltip title="Details about Activitate">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Descrierea riscului
                    <Tooltip title="Details about Descrierea riscului">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Circumstanțe care favorizează apariția riscului
                    <Tooltip title="Details about Circumstanțe care favorizează apariția riscului">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    Risc Inerent
                  </TableCell>
                  <TableCell align="center" rowSpan={2}>
                    Strategia adoptată pentru risc
                    <Tooltip title="Details about Strategia adoptată pentru risc">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    Probabilitate
                    <Tooltip title="Details about Probabilitate">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    Impact
                    <Tooltip title="Details about Impact">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.risks.map((risk, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.riskZone}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].riskZone`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.activity}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].activity`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.riskDescription}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].riskDescription`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.riskCircumstances}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].riskCircumstances`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.probability}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].probability`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.impact}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].impact`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        multiline
                        value={risk.riskStrategy}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `risks[${index}].riskStrategy`,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeRiskRow(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <IconButton onClick={addRiskRow}>
              <AddCircleIcon fontSize="large" color="primary" />
            </IconButton>
          </TableContainer>
        </div>

        {/* Evaluare */}
        <label className={labelClass}>Evaluare</label>
        <TextField
          fullWidth
          multiline
          rows={2}
          id="evaluation"
          name="evaluation"
          type="text"
          value={formik.values.evaluation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.evaluation && Boolean(formik.errors.evaluation)}
          helperText={formik.touched.evaluation && formik.errors.evaluation}
          className={inputGroupClass}
        />

        {/* Improvements */}
        <label className={labelClass}>Imbunătățiri</label>
        <TextField
          fullWidth
          multiline
          rows={2}
          id="improvements"
          name="improvements"
          type="text"
          value={formik.values.improvements}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.improvements && Boolean(formik.errors.improvements)
          }
          helperText={formik.touched.improvements && formik.errors.improvements}
          className={inputGroupClass}
        />
        <br />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          onClick={() => {
            downloadJson(
              formik.values,
              `Fisa-De-Activitate-${formik.values.activityName}`
            );
          }}
          // other props like size, fullWidth, etc.
        >
          Descarca fisierul pentru editare ulterioara
        </Button>
        <br />
        <br />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          // other props like size, fullWidth, etc.
        >
          Genereaza fisa de activitate
        </Button>
      </form>

      {renderPDF && (
        <PDFGenerator data={formik.values} setRenderPDF={setRenderPDF} />
      )}
    </div>
  );
};

export default Form;
