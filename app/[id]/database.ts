import { kv } from "@vercel/kv";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export interface BoardBase {
  id: string;
  title: string;
  description: string;
}

export interface ReportBoard<T extends unknown = any> extends BoardBase {
  type: "report";
  reportDataSchema: z.ZodSchema<T>;
  needsApproval: "yes" | "no" | "optional";
  getTextualDescription: (data: T) => string | Promise<string>;
}

export interface ReportContent<T extends unknown = unknown> {
  id: string;
  boardId: string;
  data: T;
  approved: boolean;
  contactPhone: string;
}

export interface LinkBoard extends BoardBase {
  type: "link";
  url: string;
}

export type Board = ReportBoard | LinkBoard;

function board<T>(board: ReportBoard<T>) {
  return board;
}

export const boards: Board[] = [
  {
    id: "instagram-missing-board",
    title: "לוח נעדרים באינסטגרם",
    description: "לוח לחיפוש או דיווח על נעדרים באינסטגרם, חשיפה גבוהה",
    type: "link",
    url: "https://www.instagram.com/weareoneisrael/",
  },
  {
    id: "online-missing-board",
    title: "לוח נעדרים",
    description: "ממשק לחיפוש או דיווח על נעדרים",
    type: "link",
    url: "https://www.instagram.com/weareoneisrael/",
  },
  board<{
    name: string;
    phone: string;
    address: string;
    description: string;
  }>({
    id: "civilian-help-apartments",
    title: "לוח דירות אירוח",
    description: "לוח דירות באיזורים המוגנים",
    type: "report",
    needsApproval: "optional",
    reportDataSchema: z.object({
      name: z.string({
        description: "שם המארח",
      }),
      phone: z.string({
        description: "טלפון המארח",
      }),
      address: z.string({
        description: "כתובת הדירה",
      }),
      description: z.string({
        description: "תיאור כללי",
      }),
    }),
    getTextualDescription: (data) => {
      return `דירה של ${data.name} בכתובת ${data.address}`;
    },
  }),
];

export async function addReport(
  boardId: string,
  data: unknown,
  contactPhone: string
): Promise<void> {
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    throw new Error("Board not found");
  }
  if (board.type !== "report") {
    throw new Error("Board is not a report board");
  }
  if (!contactPhone.startsWith("05") || contactPhone.length !== 10) {
    throw new Error("Contact phone is invalid");
  }
  const reportData = board.reportDataSchema.parse(data);
  const report: ReportContent = {
    id: uuid(),
    boardId,
    data: reportData,
    approved: board.needsApproval === "no",
    contactPhone,
  };
  // transaction
  const boardReports = await kv.get<{
    reports: string[];
  }>(`board-${boardId}`);
  if (!boardReports) {
    await kv.set(`board-${boardId}`, {
      reports: [report.id],
    });
  } else {
    await kv.set(`board-${boardId}`, {
      reports: [...boardReports.reports, report.id],
    });
  }
  await kv.set(`report-${report.id}`, report);
}

export async function getReport(
  boardId: string,
  reportId: string
): Promise<ReportContent | null> {
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    throw new Error("Board not found");
  }
  if (board.type !== "report") {
    throw new Error("Board is not a report board");
  }
  const report = await kv.get<ReportContent>(`report-${reportId}`);
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.boardId !== boardId) {
    throw new Error("Report not found");
  }
  return report;
}

export async function getReports(
  boardId: string,
  limit?: number,
  offset?: number,
  search?: string
): Promise<ReportContent[]> {
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    throw new Error("Board not found");
  }
  if (board.type !== "report") {
    throw new Error("Board is not a report board");
  }
  const boardReports = await kv.get<{
    reports: string[];
  }>(`board-${boardId}`);
  if (!boardReports) {
    return [];
  }
  const reports = await Promise.all(
    boardReports.reports
      .slice(offset ?? 0, limit ? (offset || 0) + limit : undefined)
      .map(async (reportId) => {
        const report = await kv.get<ReportContent>(`report-${reportId}`);
        if (!report) {
          return null;
        }
        if (search && !JSON.stringify(report.data).includes(search)) {
          return null;
        }
        return report;
      })
  );
  return reports.filter((r) => !!r) as ReportContent[];
}
