import Link from "next/link";
import { approveReport } from "../../database";
import { Message } from "@/app/message";

export default async function Verify({
  params: { id, secret },
}: {
  params: {
    id: string;
    secret: string;
  };
}) {
  const approve = await approveReport(id, secret)
    .then(() => true)
    .catch((e) => {
      return false;
    });

  if (!approve) {
    return <Message>הפוסט לא אומת</Message>;
  }

  return (
    <Message>
      הפוסט אומת בהצלחה
      <div style={{ fontSize: "medium" }}>
        ניתן למחוק אותו על ידי לחיצה
        <Link
          href={`/${id}/delete/${secret}`}
          // span
          style={{
            color: "red",
            textDecoration: "underline",
            cursor: "pointer",
            display: "inline",
            marginRight: "0.5rem",
          }}
        >
          כאן
        </Link>
      </div>
    </Message>
  );
}
