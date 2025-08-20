import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME || "clone_coding_dummy",
  waitForConnections: true, // default가 true긴 함
  connectionLimit: 10, // 이거도 default가 10이긴 함
});

export default pool;
