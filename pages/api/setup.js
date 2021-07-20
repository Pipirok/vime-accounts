import { Pool } from "pg";

export default async (req, res) => {
  try {
    const pool = new Pool({ connectionString: process.env.PG_CON_STRING });
    await pool.connect();
    await pool.query(`CREATE TABLE IF NOT EXISTS vime_accounts (
            login VARCHAR(16) NOT NULL UNIQUE,
            level NUMERIC DEFAULT 0
        );`);
    await pool.query(`CREATE TABLE IF NOT EXISTS accounts_to_register (
            login VARCHAR(16) NOT NULL UNIQUE
        );`);
    res.status(200).json({
      error: false,
      msg: "Success - you may now reload the page (app will reload it automatically in the future)",
    });
  } catch (e) {
    res.status(500).json({ error: true, msg: e });
  }
};
