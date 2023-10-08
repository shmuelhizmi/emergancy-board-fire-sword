import { kv } from "@vercel/kv";
import React from "react";
import { v4 as uuid } from "uuid";

import twilio from "twilio";
import { boards } from "./boards";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export interface ReportContent {
  id: string;
  secret: string;
  boardId: string;
  data: Record<string, string>;
  approved: boolean;
  contactPhone: string;
}

export async function addReport(
  boardId: string,
  data: Record<string, string>,
  contactPhone: string
): Promise<string> {
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
  // validation
  for (const field of board.reportDataSchema) {
    if (field.required && !data[field.id]) {
      throw new Error(`Missing required field ${field.id}`);
    }
    if (data[field.id] && typeof data[field.id] !== "string") {
      throw new Error(`Field ${field.id} is not a string`);
    }
  }
  const report: ReportContent = {
    id: uuid(),
    secret: uuid().split("-")[0],
    boardId,
    data: data,
    approved: board.needsApproval === "no",
    contactPhone,
  };
  console.log("Adding report", report);
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
  console.log("Sending verification SMS");
  await sendVerificationSms(contactPhone, report.id, report.secret);
  return report.id;
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

export async function deleteReport(reportId: string, secret: string) {
  const report = await kv.get<ReportContent>(`report-${reportId}`);
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.secret !== secret) {
    throw new Error("Invalid secret");
  }
  await kv.del(`report-${reportId}`);
  const boardReports = await kv.get<{
    reports: string[];
  }>(`board-${report.boardId}`);
  if (!boardReports) {
    throw new Error("Board not found");
  }
  await kv.set(`board-${report.boardId}`, {
    reports: boardReports.reports.filter((r) => r !== reportId),
  });
}
export async function approveReport(reportId: string, secret: string) {
  const report = await kv.get<ReportContent>(`report-${reportId}`);
  if (!report) {
    throw new Error("Report not found");
  }
  if (report.secret !== secret) {
    throw new Error("Invalid secret");
  }
  await kv.set(`report-${reportId}`, {
    ...report,
    approved: true,
  });
}

export async function sendVerificationSms(
  phone: string,
  reportId: string,
  secret: string
) {
  const message = `אנא אשר את הפוסט בקישור הבא: ${process.env.NEXT_PUBLIC_BASE_URL}/${reportId}/verify/${secret}

  בכל רגע נתון תוכל להסיר את הפוסט דרך אותו הקישור.

  תודה
  `;
  const to = '+972' + phone.slice(1);
  const messageIns = await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to,
  });
  console.log(
    `Sent verification SMS to ${to} with message SID ${messageIns.sid}`,
    message
  );
  
}
