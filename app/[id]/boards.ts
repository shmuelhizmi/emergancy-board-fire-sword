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
    id: "online-emotional-support",
    title: 'עמותת ער"ן',
    description:
      'עמותת ער"ן מספקת שירות סיוע הומניטרי, המעניק עזרה ראשונה נפשית מצילה חיים בטלפון ובאינטרנט.',
    url: "tel:1201",
    type: "link",
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
  {
    title: "עזרה בהסעות",
    description: "הגשת\\הצעת סיוע בהסעות",
    id: "civilian-help-rides",
    type: "report",
    reportDataSchema: [
      {
        title: "שם המתנדב",
        description: "שם המתנדב לצורך יצירת קשר",
        required: true,
        type: "text",
        id: "name",
      },
      {
        title: "טלפון המתנדב",
        description: "טלפון המתנדב לצורך יצירת קשר",
        required: true,
        type: "phone",
        id: "phone",
      },
      {
        title: "איזור הסיוע",
        description: "איזור הסיוע של המתנדב",
        required: true,
        type: "text",
        id: "area",
      },
      {
        title: "מידע נוסף",
        description: "מידע נוסף של המתנדב",
        required: false,
        type: "textarea",
        id: "description",
      },
    ],
    getTextualDescription: (data) => {
      return `${data.name} מתנדב להסעות באיזור ${data.area}`;
    },
    needsApproval: "yes",
  },
  {
    id: "general-help",
    title: "סיוע כללי",
    description: "סיוע בנושא שלא נכללל בלוחות האחרים",
    type: "report",
    needsApproval: "optional",
    reportDataSchema: [
      {
        title: "כותרת",
        description: "תיאור כללי של הצעתת הסיוע (נושא, איזור וכו..)",
        required: true,
        type: "text",
        id: "title",
      },
      {
        title: "שם המתנדב",
        description: "שם המתנדב לצורך יצירת קשר",
        required: true,
        type: "text",
        id: "name",
      },
      {
        title: "טלפון המתנדב",
        description: "טלפון המתנדב לצורך יצירת קשר",
        required: true,
        type: "phone",
        id: "phone",
      },
      {
        title: "מידע נוסף",
        description: "מידע נוסף של המתנדב",
        required: false,
        type: "textarea",
        id: "description",
      },
    ],
    getTextualDescription: (data) => {
      return data.title;
    },
  },
  {
    id: 'open-board-for-usful-services',
    title: 'לוח פתוח לשיתוף שירותים שימושיים',
    description: 'צפיה או הוספה של לינקים לשירותים שימושיים לעת זו',
    getTextualDescription: ({ title }) => title,
    type: 'report',
    needsApproval: 'optional',
    reportDataSchema: [
      {
        title: 'כותרת',
        description: 'כותרת לצורך יצירת קשר',
        required: true,
        type: 'text',
        id: 'title',
      },
      {
        title: 'קישור',
        description: 'קישור לצורך יצירת קשר',
        required: true,
        type: 'text',
        id: 'url',
      },
      {
        title: 'תיאור',
        description: 'תיאור כללי של הצעתת השירות',
        required: false,
        type: 'textarea',
        id: 'description',
      },
    ],
  }
];
