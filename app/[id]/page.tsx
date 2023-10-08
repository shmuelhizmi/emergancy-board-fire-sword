import {} from "@chakra-ui/react";
import { getReports, boards, ReportBoard } from "./database";

export default async function Reports({ params }: { params: { id: string } }) {
  const boardID = params.id;
  const reports = await getReports(boardID);
  const board = boards.find((board) => board.id === boardID) as ReportBoard;
  return (
    <main>
      <h1>{board.title}</h1>
      {reports.map((report) => (
        <div
          key={report.id}
          style={{ backgroundColor: report.approved ? "green" : "gray" }}
        >
          <h2>{board.getTextualDescription(report)}</h2>
        </div>
      ))}
    </main>
  );
}
