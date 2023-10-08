import { Button, Text } from "@chakra-ui/react";
import {
  boards,
  ReportBoard,
  RequestedField,
  fieldTypes,
  getReport,
} from "../../database";
import styles from "../../../page.module.css";

export default async function Reports({
  params,
}: {
  params: { id: string; ["report-id"]: string };
}) {
  const { id: boardID, ["report-id"]: reportId } = params;
  const board = boards.find((board) => board.id === boardID) as ReportBoard;
  const report = (await getReport(boardID, reportId))!;

  return (
    <>
      <main className={styles.main}>
        <Text fontSize="2xl">{board.title} - הוספה</Text>
        <SchemaView schema={board.reportDataSchema} data={report.data} />
      </main>
    </>
  );
}

interface SchemaViewProps {
  schema: RequestedField[];
  data: Record<string, string>;
}

export function SchemaView(props: SchemaViewProps) {
  const data = props.data || {};
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "90%",
      }}
    >
      {props.schema.map((field) => (
        <div key={field.id}>
          {fieldTypes[field.type].renderData(field, data[field.id])}
        </div>
      ))}
    </div>
  );
}
