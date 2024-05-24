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
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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
  const { id, name, tipo } = req.body;
  switch (method) {
    case "GET":
      const users = await query("SELECT * FROM verduras;");
      res.status(200).json({ success: true, data: users });
      break;

    case "POST":
      if (!name || !tipo) {
        res
          .status(400)
          .json({ success: false, message: "Name and tipo are required" });
        return;
      }
      try {
        const result: any = await query(
          "INSERT INTO verduras (name, tipo) VALUES (?, ?);",
          [name, tipo]
        );
        res.status(201).json({
          success: true,
          data: "Usuario creado",
          message: `ID del nuevo usuario: ${result.insertId}`,
        });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.massage });
      }
      break;

    case "PUT":
      if (!id) {
        res.status(400).json({ success: false, message: "ID is required" });
        return;
      }
      const fields = [];
      const values = [];
      if (name) {
        fields.push("name = ?");
        values.push(name);
      }
      if (tipo) {
        fields.push("tipo = ?");
        values.push(tipo);
      }
      if (fields.length === 0) {
        res
          .status(400)
          .json({ success: false, message: "No fields provided for update" });
        return;
      }
      const sql = `UPDATE verduras SET ${fields.join(", ")} WHERE id = ?;`;
      values.push(id);
      try {
        await query(sql, values);
        res.status(200).json({ success: true, data: "Usuario actualizado" });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      const { deleteId } = req.body;
      if (!deleteId) {
        res
          .status(400)
          .json({ success: false, message: "ID is required for deletion" });
        return;
      }
      try {
        await query("DELETE FROM verduras WHERE id = ?;", [deleteId]);
        res.status(200).json({ success: true, data: "Usuario eliminado" });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
