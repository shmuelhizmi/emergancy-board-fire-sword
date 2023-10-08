import { addReport } from "@/app/[id]/database";

export async function POST(request: Request) {
  const { boardID, data, contactPhone } = await request.json();
  return addReport(boardID, data, contactPhone)
    .then((res) => {
      return Response.json(res);
    })
    .catch((err) => {
      console.log(err);
      return Response.json(err, { status: 500 });
    });
}