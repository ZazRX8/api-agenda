import { query } from "@/data/mysql/mysql-client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name?: string;
  success?: boolean;
  data?: any;
  message?: string;
};

// решение ошибки между локалхостами
function setCORSHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  setCORSHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const { method } = req;
  switch (method) {
    case "GET":
      console.log(req.query);
      const users = await query(
        `SELECT * FROM contacts2 WHERE id = ${req.query.id};`
      );
      res.status(200).json({ success: true, data: users });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
