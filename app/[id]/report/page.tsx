"use client";
import { Button, Text } from "@chakra-ui/react";
import {
  boards,
  ReportBoard,
  RequestedField,
  fieldTypes,
  addReport,
} from "../database";
import styles from "../../page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Reports({ params }: { params: { id: string } }) {
  const boardID = params.id;
  const board = boards.find((board) => board.id === boardID) as ReportBoard;
  const [data, setData] = useState<Record<string, string>>();
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const send = async (contactPhone: string) => {
    if (!data) return;
    // await addReport(boardID, data, contactPhone);
    setIsSending(true);
    const { id } = await fetch("/api/add-report", {
      method: "POST",
      body: JSON.stringify({
        boardID,
        data,
        contactPhone,
      }),
    }).then((res) => res.json());
    router.push(`/${boardID}/view/${id}`);
  };
  if (isSending) {
    return (
      <main className={styles.main}>
        <Text fontSize="2xl">אנא המתן...</Text>
      </main>
    );
  }
  return (
    <>
      <main className={styles.main}>
        <Text fontSize="2xl">{board.title} - הוספה</Text>
        {data ? (
          <SchemaInput
            schema={[
              {
                id: "phone",
                title: "על מנת לאשר את הדיווח נא הזן טלפון ליצירת קשר",
                description: "אנא הוסף טלפון ליצירת קשר על מנת לאשר את הדיווח",
                type: "phone",
                required: true,
              },
            ]}
            onSubmit={({ phone }) => send(phone)}
          />
        ) : (
          <SchemaInput schema={board.reportDataSchema} onSubmit={setData} />
        )}
      </main>
    </>
  );
}

interface SchemaInputProps {
  schema: RequestedField[];
  onSubmit: (data: Record<string, string>) => void;
}

export function SchemaInput(props: SchemaInputProps) {
  const [data, setData] = useState<Record<string, string>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "90%",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.schema.some((field) => field.required && !data[field.id])) {
          setMissingFields(
            props.schema
              .filter((field) => field.required && !data[field.id])
              .map((field) => field.title)
          );
          return;
        }
        props.onSubmit(data);
      }}
    >
      {props.schema.map((field) => (
        <div key={field.id}>
          {fieldTypes[field.type].renderInput(field, data[field.id], (data) => {
            setData((prev) => ({ ...prev, [field.id]: data }));
            setMissingFields((prev) => prev.filter((f) => f !== field.title));
          })}
        </div>
      ))}
      {missingFields.length > 0 && (
        <Text color="red.500">
          אנא מלא את השדות הבאים: {missingFields.join(", ")}
        </Text>
      )}
      <Button type="submit">שלח</Button>
    </form>
  );
}
