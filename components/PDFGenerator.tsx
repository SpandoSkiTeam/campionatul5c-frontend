"use client";
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Text,
  Font,
} from "@react-pdf/renderer";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import ScoutsLogoImage from "../public/logoCercetasiiRomaniei.png";
import { FormValues } from "./Form";

Font.register({
  family: "Roboto-Regular",
  src: "/fonts/Roboto-Regular.ttf",
});

Font.register({
  family: "Roboto-Bold",
  src: "/fonts/Roboto-Bold.ttf",
});

Font.register({
  family: "Roboto-Italic",
  src: "/fonts/Roboto-Italic.ttf",
});

export function useWindowResize() {
  const [state, setState] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handler = () => {
      setState((state) => {
        const { innerWidth, innerHeight } = window;
        //Check state for change, return same state if no change happened to prevent rerender
        return state.width !== innerWidth || state.height !== innerHeight
          ? {
              width: innerWidth,
              height: innerHeight,
            }
          : state;
      });
    };

    handler();
    window.addEventListener("resize", handler, {
      capture: false,
      passive: true,
    });
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return state;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontFamily: "Roboto-Regular",
    paddingBottom:20,
    paddingTop:20
  },
  header: {
    margin: 10,
    maxHeight: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    margin: 30,
  },
  content: {
    margin: 30,
  },
  tableHeader: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderTopStyle: "solid",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    padding: 5,
    fontSize: 13,
  },
  logo: {
    height: 74,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Roboto-Bold",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto-Italic",
    marginLeft: 20,
  },
  sectionData: {
    fontSize: 13,
    marginLeft: 40,
  },
});

const MyDocument = (data: FormValues) => {
  console.log(data);
  return (
    <Document>
      <Page orientation="portrait" size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src="/images/logoSFH.png" style={styles.logo} />
          </View>
          <View>
            <Image
              src="/images/logoCercetasiiRomaniei.png"
              style={styles.logo}
            />
          </View>
          <View>
            <Image src="/images/logoScoutsCluj.png" style={styles.logo} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>FIȘĂ DE ACTIVITATE</Text>

          {/* Add your content here */}
          <Text style={styles.sectionTitle}>1. Ramura de vârstă:</Text>
          <Text style={styles.sectionData}>{data.ageGroup}</Text>

          <Text style={styles.sectionTitle}>2. Aria de dezvoltare:</Text>
          <Text style={styles.sectionData}>{data.developmentArea}</Text>

          <Text style={styles.sectionTitle}>3. Denumirea activității:</Text>
          <Text style={styles.sectionData}>{data.activityName}</Text>

          <Text style={styles.sectionTitle}>4. Loc de desfășurare:</Text>
          <Text style={styles.sectionData}>{data.location}</Text>

          <Text style={styles.sectionTitle}>5. Perioada:</Text>
          <Text style={styles.sectionData}>{data.period}</Text>

          <Text style={styles.sectionTitle}>6. Durata:</Text>
          <Text style={styles.sectionData}>{data.duration}</Text>

          <Text style={styles.sectionTitle}>7. Număr de participanți:</Text>
          <Text style={styles.sectionData}>{data.numberOfParticipants}</Text>

          <Text style={styles.sectionTitle}>8. Obiective:</Text>
          {data.activityObjectives.map((obj, index) => (
            <Text style={styles.sectionData} key={"objective" + index}>
              - {obj}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>9. Descrierea activității:</Text>
          <Text style={styles.sectionSubtitle}>a. Cadru simbolic:</Text>
          <Text style={styles.sectionData}>
            {data.activityDescription.symbolicFramework}
          </Text>
          <Text style={styles.sectionSubtitle}>b. Descrierea detaliată:</Text>
          <Text style={styles.sectionData}>
            {data.activityDescription.description}
          </Text>
          {/* Table Header */}

          <Text style={styles.sectionTitle}>10. Materiale necesare:</Text>
          <Text style={styles.sectionData}>{data.requiredMaterials}</Text>

          <Text style={styles.sectionTitle}>11. Analiza riscurilor:</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Zona de risc</Text>
            <Text style={styles.tableCell}>Activitate</Text>
            <Text style={styles.tableCell}>Descriere</Text>
            <Text style={styles.tableCell}>Circumstanțe</Text>
            <Text style={styles.tableCell}>Probabilitate</Text>
            <Text style={styles.tableCell}>Impact</Text>
            <Text style={styles.tableCell}>Strategia</Text>
          </View>

          {/* Table of risks */}
          {data.risks.map((risk, index) => (
            <View style={styles.tableRow} key={"risk" + index}>
              <Text style={styles.tableCell}>{risk.riskZone}</Text>
              <Text style={styles.tableCell}>{risk.activity}</Text>
              <Text style={styles.tableCell}>{risk.riskDescription}</Text>
              <Text style={styles.tableCell}>{risk.riskCircumstances}</Text>
              <Text style={styles.tableCell}>{risk.probability}</Text>
              <Text style={styles.tableCell}>{risk.impact}</Text>
              <Text style={styles.tableCell}>{risk.riskStrategy}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>
            12. Metoda de evaluarea activităţii cu beneficiarii::
          </Text>
          <Text style={styles.sectionData}>{data.evaluation}</Text>

          <Text style={styles.sectionTitle}>
            13. Cum pot fi obţinute mai multe de la această activitate:
          </Text>
          <Text style={styles.sectionData}>{data.improvements}</Text>
        </View>
      </Page>
    </Document>
  );
};

function PDFGenerator({
  setRenderPDF,
  data,
}: {
  setRenderPDF: (value: boolean) => void;
  data: FormValues;
}) {
  const { width, height } = useWindowResize();
  return (
    <div style={{ position: "fixed", top: 10 }}>
      <IconButton
        style={{
          position: "absolute",
          top: "4rem",
          right: "1rem",
          fontSize: "20px",
          gap: "5px",
          alignItems: "center",
        }}
        onClick={() => setRenderPDF(false)}
      >
        <CloseIcon style={{ color: "white" }} />
        <span style={{ color: "white" }}>Close</span>
      </IconButton>
      <PDFViewer showToolbar={true} width={width} height={height}>
        <MyDocument {...data} />
      </PDFViewer>
    </div>
  );
}

export default PDFGenerator;
