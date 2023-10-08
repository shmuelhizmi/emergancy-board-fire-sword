import { Message } from "@/app/message";
import { deleteReport } from "../../database";

export default async function Delete({
  params: { id, secret },
}: {
  params: {
    id: string;
    secret: string;
  };
}) {
  const success = await deleteReport(id, secret)
    .then(() => true)
    .catch((e) => {
      return false;
    });
  if (!success) {
    return <Message>הפוסט לא נמצא</Message>;
  }

  return <Message>הפוסט נמחק בהצלחה</Message>;
}
