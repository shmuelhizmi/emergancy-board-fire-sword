import { getReports } from "./database";
import List from "../list";
import styles from "../page.module.css";
import { ReportBoard, boards } from "./boards";

export default async function Reports({ params }: { params: { id: string } }) {
  const boardID = params.id;
  const reports = await getReports(boardID).then((reports) =>
    reports.filter((report) => report.approved)
  );
  const board = boards.find((board) => board.id === boardID) as ReportBoard;
  return (
    <>
      <main className={styles.main}>
        <List
          items={[
            {
              title: "הוספה +",
              description: "",
              color: "green.200",
              id: "add",
              link: `/${boardID}/report`,
            },
            ...reports.map((report) => ({
              color: report.approved ? "green.200" : "gray.200",
              id: report.id,
              link: `/${boardID}/view/${report.id}`,
              title: board.getTextualDescription(report.data),
              description: "",
            })),
          ]}
          title={board.title}
        />
        {/* <h1>{board.title}</h1>
      {reports.map((report) => (
        <div
          key={report.id}
          style={{ backgroundColor: report.approved ? "green" : "gray" }}
        >
          <h2>{board.getTextualDescription(report)}</h2>
        </div>
      ))} */}
      </main>
    </>
  );
}
