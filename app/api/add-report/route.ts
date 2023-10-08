import { addReport } from "@/app/[id]/database";

export async function POST(request: Request) {
  const { boardID, data, contactPhone } = await request.json();
  return addReport(boardID, data, contactPhone)
    .then((res) => {
      return new Response(JSON.stringify({ id: res }), {
        headers: { "content-type": "application/json" },
      });
    })
    .catch((err) => {
      return new Response(JSON.stringify(err), {
        headers: { "content-type": "application/json" },
      });
    });
}
