import { RequestedField } from "./fields";

export interface BoardBase {
  id: string;
  title: string;
  description: string;
}

export interface ReportBoard extends BoardBase {
  type: "report";
  reportDataSchema: RequestedField[];
  needsApproval: "yes" | "no" | "optional";
  getTextualDescription: (data: Record<string, string>) => string;
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
