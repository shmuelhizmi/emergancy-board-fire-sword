import { kv } from "@vercel/kv";
import React from "react";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

export interface BoardBase {
  id: string;
  title: string;
  description: string;
}

export type FieldBase<T extends string> = {
  type: T;
  renderData: (field: RequestedField, data: string) => React.ReactNode;
  renderInput: (
    field: RequestedField,
    data: string,
    onChange: (data: string) => void
  ) => React.ReactNode;
};

export type RequestedField = {
  type: keyof typeof fieldTypes;
  id: string;
  title: string;
  description: string;
  required: boolean;
};

export interface ReportBoard extends BoardBase {
  type: "report";
  reportDataSchema: RequestedField[];
  needsApproval: "yes" | "no" | "optional";
  getTextualDescription: (data: Record<string, string>) => string;
}

export interface ReportContent {
  id: string;
  boardId: string;
  data: Record<string, string>;
  approved: boolean;
  contactPhone: string;
}

export interface LinkBoard extends BoardBase {
  type: "link";
  url: string;
}

export type Board = ReportBoard | LinkBoard;

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
  {
    id: "civilian-help-apartments",
    title: "לוח דירות אירוח",
    description: "לוח דירות באיזורים המוגנים",
    type: "report",
    needsApproval: "optional",
    // reportDataSchema: z.object({
    //   name: z.string({
    //     description: "שם המארח",
    //   }),
    //   phone: z.string({
    //     description: "טלפון המארח",
    //   }),
    //   address: z.string({
    //     description: "כתובת הדירה",
    //   }),
    //   description: z.string({
    //     description: "תיאור כללי",
    //   }),
    // }),
    reportDataSchema: [
      {
        title: "שם המארח",
        description: "שם המארח לצורך יצירת קשר",
        required: true,
        type: "text",
        id: "name",
      },
      {
        title: "טלפון המארח",
        description: "טלפון המארח לצורך יצירת קשר",
        required: true,
        type: "phone",
        id: "phone",
      },
      {
        title: "כתובת הדירה",
        description: "כתובת הדירה לצורך יצירת קשר",
        required: true,
        type: "text",
        id: "address",
      },
      {
        title: "תיאור כללי",
        description: "תיאור כללי של הצעת האירוח",
        required: false,
        type: "textarea",
        id: "description",
      },
    ],
    getTextualDescription: (data) => {
      return `דירה של ${data.name} בכתובת ${data.address}`;
    },
  },
];

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
    boardId,
    data: data,
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

export const fieldTypes = {
  text: {
    renderData: (field: RequestedField, data: string) => {
      return <Text fontSize={'small'}>{field.title}: {data}</Text>;
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Input
            type="text"
            value={data}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormControl>
      );
    },
  },
  textarea: {
    renderData: (field: RequestedField, data: string) => {
      return <Text fontSize={'small'}>{field.title}: {data}</Text>;
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Textarea
            value={data}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormControl>
      );
    },
  },
  checkbox: {
    renderData: (field: RequestedField, data: string) => {
      return <Text fontSize={'small'}>{field.title}: {data}</Text>;
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Checkbox
            isChecked={data === "true"}
            onChange={(e) => onChange(e.target.checked.toString())}
          />
        </FormControl>
      );
    },
  },
  phone: {
    renderData: (field: RequestedField, data: string) => {
      return <Text fontSize={'small'}>{field.title}: {data}</Text>;
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <InputGroup>
            <Input
              type="tel"
              value={data}
              onChange={(e) => onChange(e.target.value)}
            />
          </InputGroup>
        </FormControl>
      );
    },
  },
};