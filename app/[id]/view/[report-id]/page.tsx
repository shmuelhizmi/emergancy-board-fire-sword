import { Text } from "@chakra-ui/react";
import { getReport } from "../../database";
import styles from "../../../page.module.css";
import { ReportBoard, boards } from "../../boards";
import { RequestedField, fieldTypes } from "../../fields";
import { Message } from "@/app/message";

export default async function Reports({
  params,
}: {
  params: { id: string; ["report-id"]: string };
}) {
  const { id: boardID, ["report-id"]: reportId } = params;
  const board = boards.find((board) => board.id === boardID) as ReportBoard;
  const report = await getReport(boardID, reportId).catch(() => undefined);
  if (!report) {
    return <Message>הפוסט לא נמצא</Message>;
  }

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
