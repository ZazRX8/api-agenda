import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "agenda",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (query: string, values?: any[] | undefined) => {
  const [results] = await pool.query(query, values);
  return results;
};
